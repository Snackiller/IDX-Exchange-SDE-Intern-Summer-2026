function validatePropertyFilters(rawFilters = {}) {
    const filters = {};
  
    if (
      typeof rawFilters.city === "string" &&
      rawFilters.city.trim() !== ""
    ) {
      filters.city = rawFilters.city.trim();
    }
  
    if (
      typeof rawFilters.zipcode === "string" &&
      rawFilters.zipcode.trim() !== ""
    ) {
      filters.zipcode = rawFilters.zipcode.trim();
    }
  
    if (
      rawFilters.minPrice !== null &&
      rawFilters.minPrice !== undefined
    ) {
      const value = Number(rawFilters.minPrice);
  
      if (Number.isFinite(value) && value >= 0) {
        filters.minPrice = value;
      }
    }
  
    if (
      rawFilters.maxPrice !== null &&
      rawFilters.maxPrice !== undefined
    ) {
      const value = Number(rawFilters.maxPrice);
  
      if (Number.isFinite(value) && value >= 0) {
        filters.maxPrice = value;
      }
    }
  
    if (
      rawFilters.beds !== null &&
      rawFilters.beds !== undefined
    ) {
      const value = Number(rawFilters.beds);
  
      if (
        Number.isInteger(value) &&
        value >= 0
      ) {
        filters.beds = value;
      }
    }
  
    if (
      rawFilters.baths !== null &&
      rawFilters.baths !== undefined
    ) {
      const value = Number(rawFilters.baths);
  
      if (Number.isFinite(value) && value >= 0) {
        filters.baths = value;
      }
    }
  
    if (
      rawFilters.minYearBuilt !== null &&
      rawFilters.minYearBuilt !== undefined
    ) {
      const value = Number(rawFilters.minYearBuilt);
  
      if (
        Number.isInteger(value) &&
        value >= 1800 &&
        value <= 2100
      ) {
        filters.minYearBuilt = value;
      }
    }
  
    if (
      rawFilters.maxYearBuilt !== null &&
      rawFilters.maxYearBuilt !== undefined
    ) {
      const value = Number(rawFilters.maxYearBuilt);
  
      if (
        Number.isInteger(value) &&
        value >= 1800 &&
        value <= 2100
      ) {
        filters.maxYearBuilt = value;
      }
    }
  
    return filters;
  }
  
  module.exports = validatePropertyFilters;