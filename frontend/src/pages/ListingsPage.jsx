import { useEffect, useState } from "react";
import { fetchProperties } from "../api/client";
import PropertyCard from "../components/PropertyCard";
import "./ListingsPage.css";

function ListingsPage() {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProperties() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchProperties({
          limit: 20,
          offset: 0,
        });

        if (!cancelled) {
          setProperties(data.results || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load properties.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="listings-page">
        <p>Loading properties...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="listings-page">
        <h1>Property Listings</h1>
        <p className="listings-page__error">{error}</p>
      </main>
    );
  }

  return (
    <main className="listings-page">
      <header className="listings-page__header">
        <h1>Property Listings</h1>

        <p>
          Showing {properties.length} of{" "}
          {Number(total).toLocaleString()} properties
        </p>
      </header>

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        <section className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.L_ListingID}
              property={property}
            />
          ))}
        </section>
      )}
    </main>
  );
}

export default ListingsPage;