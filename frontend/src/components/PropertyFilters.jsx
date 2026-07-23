import { useState } from "react";
import "./PropertyFilters.css";

const initialFilters = {
  city: "",
  zipcode: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
};

function PropertyFilters({ onSearch, onClear, disabled = false }) {
  const [filters, setFilters] = useState(initialFilters);

  function handleChange(event) {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(filters);
  }

  function handleClear() {
    setFilters(initialFilters);
    onClear();
  }

  return (
    <form
      className="property-filters"
      onSubmit={handleSubmit}
    >
      <div className="property-filters__grid">
        <label>
          City
          <input
            type="text"
            name="city"
            value={filters.city}
            onChange={handleChange}
            placeholder="Beverly Hills"
            disabled={disabled}
          />
        </label>

        <label>
          ZIP Code
          <input
            type="text"
            name="zipcode"
            value={filters.zipcode}
            onChange={handleChange}
            placeholder="90210"
            disabled={disabled}
          />
        </label>

        <label>
          Minimum Price
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            min="0"
            placeholder="300000"
            disabled={disabled}
          />
        </label>

        <label>
          Maximum Price
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            min="0"
            placeholder="1000000"
            disabled={disabled}
          />
        </label>

        <label>
          Bedrooms
          <select
            name="beds"
            value={filters.beds}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </label>

        <label>
          Bathrooms
          <select
            name="baths"
            value={filters.baths}
            onChange={handleChange}
            disabled={disabled}
          >
            <option value="">Any</option>
            <option value="1">1+</option>
            <option value="2">2+</option>
            <option value="3">3+</option>
            <option value="4">4+</option>
            <option value="5">5+</option>
          </select>
        </label>
      </div>

      <div className="property-filters__actions">
        <button type="submit" disabled={disabled}>
          Search
        </button>

        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
        >
          Clear Filters
        </button>
      </div>
    </form>
  );
}

export default PropertyFilters;