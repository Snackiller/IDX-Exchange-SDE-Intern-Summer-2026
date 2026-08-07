import {
    useEffect,
    useState,
  } from "react";
  
  import {
    useNavigate,
    useParams,
  } from "react-router-dom";
  
  import {
    fetchOpenHouses,
    fetchPropertyDetail,
  } from "../api/client";
  
  import PropertyImageGallery from "../components/PropertyImageGallery";
  import PropertyMap from "../components/PropertyMap";
  
  import "./PropertyDetailPage.css";
  
  
  function formatPrice(price) {
    const numericPrice = Number(price);
  
    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return "Price unavailable";
    }
  
    return numericPrice.toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }
    );
  }
  
  
  function formatDate(dateValue) {
    if (!dateValue) {
      return "Date unavailable";
    }
  
    const date = new Date(dateValue);
  
    if (Number.isNaN(date.getTime())) {
      return dateValue;
    }
  
    return date.toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  }
  
  
  function formatTime(timeValue) {
    if (!timeValue) {
      return "Time unavailable";
    }
  
    const [hours, minutes] =
      timeValue.split(":");
  
    const date = new Date();
  
    date.setHours(
      Number(hours),
      Number(minutes),
      0,
      0
    );
  
    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      }
    );
  }
  
  
  function getOpenHouseRemarks(allData) {
    if (!allData) {
      return null;
    }
  
    try {
      const parsed =
        typeof allData === "string"
          ? JSON.parse(allData)
          : allData;
  
      return parsed.OpenHouseRemarks || null;
    } catch {
      return null;
    }
  }
  
  
  function PropertyDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const [property, setProperty] =
      useState(null);
  
    const [openHouses, setOpenHouses] =
      useState([]);
  
    const [loading, setLoading] =
      useState(true);
  
    const [error, setError] =
      useState("");
  
  
    useEffect(() => {
      let cancelled = false;
  
      async function loadProperty() {
        try {
          setLoading(true);
          setError("");
  
          // First load the property itself.
          const propertyData =
            await fetchPropertyDetail(id);
  
          if (cancelled) {
            return;
          }
  
          setProperty(propertyData);
  
          // Then load its open house events.
          const openHouseData =
            await fetchOpenHouses(id);
  
          if (cancelled) {
            return;
          }
  
          setOpenHouses(
            Array.isArray(openHouseData)
              ? openHouseData
              : []
          );
        } catch (err) {
          if (cancelled) {
            return;
          }
  
          setError(
            err.message ||
              "Failed to load property."
          );
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }
  
      loadProperty();
  
      return () => {
        cancelled = true;
      };
    }, [id]);
  
  
    if (loading) {
      return (
        <main className="property-detail-page">
          <p>Loading property...</p>
        </main>
      );
    }
  
  
    if (error) {
      return (
        <main className="property-detail-page">
          <button
            type="button"
            className="back-button"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
  
          <p className="property-detail-page__error">
            {error}
          </p>
        </main>
      );
    }
  
  
    if (!property) {
      return null;
    }
  
  
    return (
      <main className="property-detail-page">
        <button
          type="button"
          className="back-button"
          onClick={() => navigate(-1)}
        >
          ← Back to Listings
        </button>
  
  
        <PropertyImageGallery
          photoValue={property.L_Photos}
          address={property.L_Address}
        />
  
  
        <section className="property-detail-page__header">
          <h1>
            {formatPrice(
              property.L_SystemPrice
            )}
          </h1>
  
          <h2>
            {property.L_Address ||
              "Address unavailable"}
          </h2>
  
          <p>
            {property.L_City || ""}
            {property.L_State
              ? `, ${property.L_State}`
              : ""}
            {property.L_Zip
              ? ` ${property.L_Zip}`
              : ""}
          </p>
        </section>
  
  
        <section className="property-detail-page__stats">
          <div>
            <strong>
              {property.L_Keyword2 ?? "—"}
            </strong>
            <span>Beds</span>
          </div>
  
          <div>
            <strong>
              {property.LM_Dec_3 ?? "—"}
            </strong>
            <span>Baths</span>
          </div>
  
          <div>
            <strong>
              {property.LM_Int2_3
                ? Number(
                    property.LM_Int2_3
                  ).toLocaleString()
                : "—"}
            </strong>
            <span>Sq Ft</span>
          </div>
  
          <div>
            <strong>
              {property.YearBuilt ?? "—"}
            </strong>
            <span>Year Built</span>
          </div>
        </section>
  
  
        <section className="property-detail-section">
          <h2>Description</h2>
  
          <p>
            {property.L_Remarks ||
              "No description available."}
          </p>
        </section>
  
  
        <section className="property-detail-section">
          <h2>Property Details</h2>
  
          <div className="property-details-grid">
            <div>
              <strong>Property Type</strong>
              <span>
                {property.L_Type_ || "—"}
              </span>
            </div>
  
            <div>
              <strong>Status</strong>
              <span>
                {property.L_Status ||
                  property.StandardStatus ||
                  "—"}
              </span>
            </div>
  
            <div>
              <strong>Lot Size</strong>
              <span>
                {property.LotSizeAcres
                  ? `${property.LotSizeAcres} acres`
                  : "—"}
              </span>
            </div>
  
            <div>
              <strong>Days on Market</strong>
              <span>
                {property.DaysOnMarket ?? "—"}
              </span>
            </div>
  
            <div>
              <strong>Garage</strong>
              <span>
                {property.GarageYN === 1
                  ? "Yes"
                  : property.GarageYN === 0
                  ? "No"
                  : "—"}
              </span>
            </div>
  
            <div>
              <strong>Cooling</strong>
              <span>
                {property.Cooling || "—"}
              </span>
            </div>
          </div>
        </section>
  
  
        <PropertyMap
          latitude={
            property.LMD_MP_Latitude
          }
          longitude={
            property.LMD_MP_Longitude
          }
        />
  
  
        <section className="property-detail-section">
          <h2>Open Houses</h2>
  
          {openHouses.length === 0 ? (
            <p>
              No open houses scheduled
            </p>
          ) : (
            <div className="open-house-list">
              {openHouses.map(
                (openHouse, index) => {
                  const remarks =
                    getOpenHouseRemarks(
                      openHouse.all_data
                    );
  
                  return (
                    <article
                      className="open-house-card"
                      key={
                        openHouse.id ||
                        `${openHouse.L_ListingID}-${index}`
                      }
                    >
                      <strong>
                        {formatDate(
                          openHouse.OpenHouseDate
                        )}
                      </strong>
  
                      <p>
                        {formatTime(
                          openHouse.OH_StartTime
                        )}
                        {" - "}
                        {formatTime(
                          openHouse.OH_EndTime
                        )}
                      </p>
  
                      {remarks && (
                        <p>
                          {remarks}
                        </p>
                      )}
                    </article>
                  );
                }
              )}
            </div>
          )}
        </section>
      </main>
    );
  }
  
  export default PropertyDetailPage;