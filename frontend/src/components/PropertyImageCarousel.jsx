import { useState } from "react";
import "./PropertyImageCarousel.css";
import { parsePhotos } from "../utils/photoUtils";

function PropertyImageCarousel({
  photoValue,
  address,
}) {
  const photos = parsePhotos(photoValue);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  if (photos.length === 0) {
    return (
      <div className="carousel__placeholder">
        No photo available
      </div>
    );
  }

  function handlePrevious(event) {
    // Prevent clicking the arrow from opening
    // the PropertyDetailPage.
    event.stopPropagation();

    setCurrentIndex((current) =>
      current === 0
        ? photos.length - 1
        : current - 1
    );
  }

  function handleNext(event) {
    event.stopPropagation();

    setCurrentIndex((current) =>
      current === photos.length - 1
        ? 0
        : current + 1
    );
  }

  return (
    <div className="carousel">
      <img
        className="carousel__image"
        src={photos[currentIndex]}
        alt={address || "Property"}
      />

      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="carousel__button carousel__button--left"
            onClick={handlePrevious}
            aria-label="Previous property photo"
          >
            ‹
          </button>

          <button
            type="button"
            className="carousel__button carousel__button--right"
            onClick={handleNext}
            aria-label="Next property photo"
          >
            ›
          </button>

          <span className="carousel__counter">
            {currentIndex + 1} / {photos.length}
          </span>
        </>
      )}
    </div>
  );
}

export default PropertyImageCarousel;