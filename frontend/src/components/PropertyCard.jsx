import { useNavigate } from "react-router-dom";

import PropertyImageCarousel from "./PropertyImageCarousel";

import "./PropertyCard.css";


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


function PropertyCard({ property }) {
  const navigate = useNavigate();

  function handleCardClick() {
    navigate(
      `/property/${property.L_ListingID}`
    );
  }

  function handleKeyDown(event) {
    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      handleCardClick();
    }
  }

  return (
    <article
      className="property-card"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <PropertyImageCarousel
        photoValue={property.L_Photos}
        address={property.L_Address}
      />

      <div className="property-card__content">
        <h2>
          {formatPrice(
            property.L_SystemPrice
          )}
        </h2>

        <p className="property-card__address">
          {property.L_Address ||
            "Address unavailable"}
        </p>

        <p>
          {property.L_City ||
            "Unknown city"}

          {property.L_State
            ? `, ${property.L_State}`
            : ""}
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
              ? `${Number(
                  property.LM_Int2_3
                ).toLocaleString()} sqft`
              : "Sqft unavailable"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;