import "./PropertyCard.css";

function parseFirstPhoto(photoValue) {
  if (!photoValue) {
    return null;
  }

  try {
    const photos =
      typeof photoValue === "string"
        ? JSON.parse(photoValue)
        : photoValue;

    if (!Array.isArray(photos) || photos.length === 0) {
      return null;
    }

    return photos[0];
  } catch {
    return null;
  }
}

function formatPrice(price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    return "Price unavailable";
  }

  return numericPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function PropertyCard({ property }) {
  const firstPhoto = parseFirstPhoto(property.L_Photos);

  return (
    <article className="property-card">
      {firstPhoto ? (
        <img
          className="property-card__image"
          src={firstPhoto}
          alt={property.L_Address || "Property"}
        />
      ) : (
        <div className="property-card__placeholder">
          No photo available
        </div>
      )}

      <div className="property-card__content">
        <h2>{formatPrice(property.L_SystemPrice)}</h2>

        <p className="property-card__address">
          {property.L_Address || "Address unavailable"}
        </p>

        <p>
          {property.L_City || "Unknown city"}
          {property.L_State ? `, ${property.L_State}` : ""}
        </p>

        <div className="property-card__stats">
          <span>
            {property.L_Keyword2 ?? "—"} beds
          </span>

          <span>
            {property.LM_Dec_3 ?? "—"} baths
          </span>

          <span>
            {property.LM_Int2_3
              ? `${Number(property.LM_Int2_3).toLocaleString()} sqft`
              : "Sqft unavailable"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;