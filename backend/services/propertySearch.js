const pool = require("../db");

async function searchProperties(filters = {}) {
  const {
    city,
    zipcode,
    minPrice,
    maxPrice,
    beds,
    baths,
    minYearBuilt,
    maxYearBuilt,
  } = filters;

  const limit =
    Number.isInteger(filters.limit)
      ? filters.limit
      : 20;

  const offset =
    Number.isInteger(filters.offset)
      ? filters.offset
      : 0;

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

  if (minPrice !== undefined) {
    conditions.push("L_SystemPrice >= ?");
    values.push(minPrice);
  }

  if (maxPrice !== undefined) {
    conditions.push("L_SystemPrice <= ?");
    values.push(maxPrice);
  }

  if (beds !== undefined) {
    conditions.push("L_Keyword2 >= ?");
    values.push(beds);
  }

  if (baths !== undefined) {
    conditions.push("LM_Dec_3 >= ?");
    values.push(baths);
  }

  if (minYearBuilt !== undefined) {
    conditions.push("YearBuilt >= ?");
    values.push(minYearBuilt);
  }

  if (maxYearBuilt !== undefined) {
    conditions.push("YearBuilt <= ?");
    values.push(maxYearBuilt);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

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
        YearBuilt,
        L_Photos
      FROM rets_property
      ${whereClause}
      LIMIT ? OFFSET ?
    `,
    [...values, limit, offset]
  );

  return {
    total: countRows[0].total,
    limit,
    offset,
    results: rows,
  };
}

module.exports = searchProperties;