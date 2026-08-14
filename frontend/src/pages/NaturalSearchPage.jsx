import {
    useState,
  } from "react";
  
  import {
    Link,
  } from "react-router-dom";
  
  import {
    searchPropertiesNatural,
  } from "../api/client";
  
  import PropertyCard from "../components/PropertyCard";
  
  import "./NaturalSearchPage.css";
  
  
  function NaturalSearchPage() {
    const [query, setQuery] =
      useState("");
  
    const [results, setResults] =
      useState([]);
  
    const [
      interpretedFilters,
      setInterpretedFilters,
    ] = useState({});
  
    const [message, setMessage] =
      useState("");
  
    const [loading, setLoading] =
      useState(false);
  
    const [error, setError] =
      useState("");
  
  
    async function handleSubmit(event) {
      event.preventDefault();
  
      const trimmedQuery =
        query.trim();
  
      if (!trimmedQuery) {
        setError(
          "Please enter a property search."
        );
  
        return;
      }
  
      try {
        setLoading(true);
        setError("");
        setMessage("");
        setResults([]);
        setInterpretedFilters({});
  
        const data =
          await searchPropertiesNatural(
            trimmedQuery
          );
  
        setResults(
          data.results || []
        );
  
        setInterpretedFilters(
          data.interpretedFilters || {}
        );
  
        if (data.message) {
          setMessage(data.message);
        } else if (
          (data.results || []).length === 0
        ) {
          setMessage(
            "No matching properties were found."
          );
        }
      } catch (err) {
        setError(
          err.message ||
            "Natural language search failed."
        );
      } finally {
        setLoading(false);
      }
    }
  
  
    function formatFilterValue(
      key,
      value
    ) {
      if (
        key === "minPrice" ||
        key === "maxPrice"
      ) {
        return Number(value).toLocaleString(
          "en-US",
          {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }
        );
      }
  
      if (key === "beds") {
        return `${value}+`;
      }
  
      if (key === "baths") {
        return `${value}+`;
      }
  
      return String(value);
    }
  
  
    return (
      <main className="natural-search-page">
        <header className="natural-search-page__header">
          <div>
            <h1>
              Natural Language Property Search
            </h1>
  
            <p>
              Describe the property you are
              looking for in plain English.
            </p>
          </div>
  
          <Link
            className="natural-search-page__link"
            to="/"
          >
            Standard Search
          </Link>
        </header>
  
  
        <form
          className="natural-search-form"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Example: 3 bedroom house in Beverly Hills under $5M"
            disabled={loading}
          />
  
          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>
        </form>
  
  
        {error && (
          <p className="natural-search-page__error">
            {error}
          </p>
        )}
  
  
        {Object.keys(
          interpretedFilters
        ).length > 0 && (
          <section className="interpreted-filters">
            <h2>
              Interpreted Search
            </h2>
  
            <div className="interpreted-filters__list">
              {Object.entries(
                interpretedFilters
              ).map(
                ([key, value]) => (
                  <span
                    key={key}
                    className="interpreted-filter"
                  >
                    {key}:{" "}
                    {formatFilterValue(
                      key,
                      value
                    )}
                  </span>
                )
              )}
            </div>
          </section>
        )}
  
  
        {message && (
          <p className="natural-search-page__message">
            {message}
          </p>
        )}
  
  
        {!loading &&
          results.length > 0 && (
            <>
              <p>
                Showing {results.length}{" "}
                matching properties
              </p>
  
              <section className="property-grid">
                {results.map(
                  (property) => (
                    <PropertyCard
                      key={
                        property.L_ListingID
                      }
                      property={
                        property
                      }
                    />
                  )
                )}
              </section>
            </>
          )}
      </main>
    );
  }
  
  export default NaturalSearchPage;