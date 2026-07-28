import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { fetchProperties } from "../api/client";
import Pagination from "../components/Pagination";
import PropertyCard from "../components/PropertyCard";
import PropertyFilters from "../components/PropertyFilters";

import "./ListingsPage.css";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [activeFilters, setActiveFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  // Prevent an older request from overwriting newer results.
  const requestIdRef = useRef(0);

  const loadProperties = useCallback(
    async (filters, page) => {
      const requestId = ++requestIdRef.current;

      try {
        setLoading(true);
        setError("");

        const data = await fetchProperties({
          ...filters,
          limit: itemsPerPage,
          offset: (page - 1) * itemsPerPage,
        });

        // Ignore an outdated response.
        if (requestId !== requestIdRef.current) {
          return;
        }

        setProperties(data.results || []);
        setTotal(Number(data.total) || 0);
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setProperties([]);
        setTotal(0);
        setError(
          err.message || "Failed to load properties."
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    loadProperties(activeFilters, currentPage);
  }, [activeFilters, currentPage, loadProperties]);

  function handleSearch(filters) {
    setActiveFilters(filters);
    setCurrentPage(1);
  }

  function handleClear() {
    setActiveFilters({});
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const start =
    total === 0
      ? 0
      : (currentPage - 1) * itemsPerPage + 1;

  const end = Math.min(
    currentPage * itemsPerPage,
    total
  );

  return (
    <main className="listings-page">
      <header className="listings-page__header">
        <h1>Property Listings</h1>

        {!loading && !error && total > 0 && (
          <p>
            Showing {start}-{end} of{" "}
            {total.toLocaleString()} properties
          </p>
        )}
      </header>

      <PropertyFilters
        onSearch={handleSearch}
        onClear={handleClear}
        disabled={loading}
      />

      {loading && <p>Loading properties...</p>}

      {!loading && error && (
        <p className="listings-page__error">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        properties.length === 0 && (
          <p className="listings-page__empty">
            No properties found. Try changing or clearing
            your filters.
          </p>
        )}

      {!loading &&
        !error &&
        properties.length > 0 && (
          <>
            <section className="property-grid">
              {properties.map((property) => (
                <PropertyCard
                  key={property.L_ListingID}
                  property={property}
                />
              ))}
            </section>

            {total > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalItems={total}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
    </main>
  );
}

export default ListingsPage;