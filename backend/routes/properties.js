const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/:id/openhouses", async (req, res) => {
  try {
    const { id } = req.params;


    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        error: "Invalid listing ID",
      });
    }
    const [propertyRows] = await pool.query(
      `
      SELECT L_ListingID
      FROM rets_property
      WHERE L_ListingID = ?
      `,
      [id]
    );
    
    if (propertyRows.length === 0) {
      return res.status(404).json({
        error: "Property not found",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT
        L_ListingID,
        OpenHouseDate,
        OH_StartTime,
        OH_EndTime,
        OH_StartDate,
        OH_EndDate,
        all_data
      FROM rets_openhouse
      WHERE L_ListingID = ?
      ORDER BY OpenHouseDate ASC
      `,
      [id]
    );


    res.json(rows);


  } catch (err) {

    console.error(
      "Failed to fetch open houses:",
      err.message
    );

    res.status(500).json({
      error: "Failed to fetch open houses",
      message: err.message,
    });

  }
});


router.get("/:id", async (req, res) => {
  try {

    const { id } = req.params;


    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        error: "Invalid listing ID",
      });
    }


    const [rows] = await pool.query(
      `
      SELECT *
      FROM rets_property
      WHERE L_ListingID = ?
      `,
      [id]
    );


    if (rows.length === 0) {
      return res.status(404).json({
        error: "Property not found",
      });
    }


    res.json(rows[0]);


  } catch(err){

    console.error(
      "Failed to fetch property:",
      err.message
    );


    res.status(500).json({
      error:"Failed to fetch property",
      message:err.message
    });

  }
});

router.get("/", async (req, res) => {
  try {
    const {
      city,
      zipcode,
      minPrice,
      maxPrice,
      beds,
      baths,
      minYearBuilt,
      maxYearBuilt,
    } = req.query;

    // Use bounded limit/offset pagination to keep individual database
    // requests predictable and prevent clients from requesting an
    // unreasonably large result set in one response.
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

    // Build SQL conditions separately from parameter values so every
    // user-supplied filter remains parameterized instead of being
    // interpolated directly into the query.
    const conditions = [];
    const values = [];

    if (city) {
      conditions.push("L_City = ?");
      values.push(city.trim());
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

    if (minYearBuilt !== undefined) {
      const value = Number(minYearBuilt);
    
      if (
        !Number.isInteger(value) ||
        value < 1800 ||
        value > 2100
      ) {
        return res.status(400).json({
          error:
            "Invalid minYearBuilt. minYearBuilt must be an integer between 1800 and 2100.",
        });
      }
    
      conditions.push("YearBuilt >= ?");
      values.push(value);
    }
    
    if (maxYearBuilt !== undefined) {
      const value = Number(maxYearBuilt);
    
      if (
        !Number.isInteger(value) ||
        value < 1800 ||
        value > 2100
      ) {
        return res.status(400).json({
          error:
            "Invalid maxYearBuilt. maxYearBuilt must be an integer between 1800 and 2100.",
        });
      }
    
      conditions.push("YearBuilt <= ?");
      values.push(value);
    }
    
    if (
      minYearBuilt !== undefined &&
      maxYearBuilt !== undefined &&
      Number(minYearBuilt) > Number(maxYearBuilt)
    ) {
      return res.status(400).json({
        error:
          "Invalid year range. minYearBuilt cannot be greater than maxYearBuilt.",
      });
    }

    // Generate one WHERE clause from the validated filters so the count
    // query and data query always operate on the exact same result set.
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

    // LIMIT and OFFSET are parameterized as well, keeping pagination
    // values separate from the SQL string just like the filter values.
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
        YearBuilt,
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