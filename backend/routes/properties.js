const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const {
      city,
      zipcode,
      minPrice,
      maxPrice,
      beds,
      baths,
    } = req.query;

    let limit = req.query.limit ? Number(req.query.limit) : 20;
    let offset = req.query.offset ? Number(req.query.offset) : 0;

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res.status(400).json({
        error: "Invalid limit. Limit must be an integer between 1 and 100.",
      });
    }

    if (!Number.isInteger(offset) || offset < 0) {
      return res.status(400).json({
        error: "Invalid offset. Offset must be a non-negative integer.",
      });
    }

    const conditions = [];
    const values = [];

    if (city) {
      conditions.push("LOWER(TRIM(L_City)) = LOWER(TRIM(?))");
      values.push(city);
    }

    if (zipcode) {
      conditions.push("L_Zip = ?");
      values.push(zipcode);
    }

    if (minPrice) {
      const value = Number(minPrice);
      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          error: "Invalid minPrice. minPrice must be a non-negative number.",
        });
      }
      conditions.push("L_SystemPrice >= ?");
      values.push(value);
    }

    if (maxPrice) {
      const value = Number(maxPrice);
      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          error: "Invalid maxPrice. maxPrice must be a non-negative number.",
        });
      }
      conditions.push("L_SystemPrice <= ?");
      values.push(value);
    }

    if (beds) {
      const value = Number(beds);
      if (!Number.isInteger(value) || value < 0) {
        return res.status(400).json({
          error: "Invalid beds. beds must be a non-negative integer.",
        });
      }
      conditions.push("L_Keyword2 >= ?");
      values.push(value);
    }

    if (baths) {
      const value = Number(baths);
      if (!Number.isFinite(value) || value < 0) {
        return res.status(400).json({
          error: "Invalid baths. baths must be a non-negative number.",
        });
      }
      conditions.push("LM_Dec_3 >= ?");
      values.push(value);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM rets_property
      ${whereClause}
      `,
      values
    );

    const [rows] = await pool.query(
      `
      SELECT
        L_ListingID,
        L_Address,
        L_City,
        L_State,
        L_Zip,
        L_SystemPrice,
        L_Keyword2,
        LM_Dec_3,
        LM_Int2_3,
        L_Photos
      FROM rets_property
      ${whereClause}
      LIMIT ? OFFSET ?
      `,
      [...values, limit, offset]
    );

    res.json({
      total: countRows[0].total,
      limit,
      offset,
      results: rows,
    });
  } catch (err) {
    console.error("Failed to fetch properties:", err.message);

    res.status(500).json({
      error: "Failed to fetch properties",
      message: err.message,
    });
  }
});

module.exports = router;