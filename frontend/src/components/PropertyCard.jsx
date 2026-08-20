import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import PropertyImageCarousel from "./PropertyImageCarousel";
import { formatPrice } from "../utils/formatters";
import "./PropertyCard.css";



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

PropertyCard.propTypes = {
  property: PropTypes.shape({
    L_ListingID: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,

    L_Photos: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.string
      ),
    ]),

    L_SystemPrice: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    L_Address: PropTypes.string,

    L_City: PropTypes.string,

    L_State: PropTypes.string,

    L_Keyword2: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    LM_Dec_3: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),

    LM_Int2_3: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }).isRequired,
};

export default PropertyCard;