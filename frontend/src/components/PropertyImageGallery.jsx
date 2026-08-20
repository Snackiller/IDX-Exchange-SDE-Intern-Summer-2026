import {
  useCallback,
  useEffect,
  useState,
} from "react";

import PropTypes from "prop-types";

import "./PropertyImageGallery.css";
import { parsePhotos } from "../utils/photoUtils";


function PropertyImageGallery({
  photoValue,
  address,
}) {
  const photos = parsePhotos(photoValue);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [lightboxOpen, setLightboxOpen] =
    useState(false);


  const previousPhoto = useCallback(() => {
    setSelectedIndex((current) =>
      current === 0
        ? photos.length - 1
        : current - 1
    );
  }, [photos.length]);


  const nextPhoto = useCallback(() => {
    setSelectedIndex((current) =>
      current === photos.length - 1
        ? 0
        : current + 1
    );
  }, [photos.length]);


  useEffect(() => {
    if (!lightboxOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setLightboxOpen(false);
      }

      if (event.key === "ArrowLeft") {
        previousPhoto();
      }

      if (event.key === "ArrowRight") {
        nextPhoto();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    lightboxOpen,
    previousPhoto,
    nextPhoto,
  ]);


  if (photos.length === 0) {
    return (
      <div className="gallery__placeholder">
        No photos available
      </div>
    );
  }


  return (
    <>
      <section className="gallery">
        <button
          type="button"
          className="gallery__main-button"
          onClick={() =>
            setLightboxOpen(true)
          }
        >
          <img
            className="gallery__main-image"
            src={photos[selectedIndex]}
            alt={address || "Property"}
          />
        </button>

        {photos.length > 1 && (
          <div className="gallery__thumbnails">
            {photos.map((photo, index) => (
              <button
                type="button"
                key={`${photo}-${index}`}
                className={`gallery__thumbnail-button ${
                  index === selectedIndex
                    ? "gallery__thumbnail-button--active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedIndex(index)
                }
              >
                <img
                  className="gallery__thumbnail"
                  src={photo}
                  alt={`Property thumbnail ${
                    index + 1
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </section>


      {lightboxOpen && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Property photo viewer"
          onClick={() =>
            setLightboxOpen(false)
          }
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxOpen(false);
            }}
            aria-label="Close photo viewer"
          >
            ×
          </button>


          {photos.length > 1 && (
            <button
              type="button"
              className="lightbox__arrow lightbox__arrow--left"
              onClick={(event) => {
                event.stopPropagation();
                previousPhoto();
              }}
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}


          <img
            className="lightbox__image"
            src={photos[selectedIndex]}
            alt={address || "Property"}
            onClick={(event) =>
              event.stopPropagation()
            }
          />


          {photos.length > 1 && (
            <button
              type="button"
              className="lightbox__arrow lightbox__arrow--right"
              onClick={(event) => {
                event.stopPropagation();
                nextPhoto();
              }}
              aria-label="Next photo"
            >
              ›
            </button>
          )}


          <div className="lightbox__counter">
            {selectedIndex + 1} /{" "}
            {photos.length}
          </div>
        </div>
      )}
    </>
  );
}


PropertyImageGallery.propTypes = {
  photoValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.string
    ),
  ]),
  address: PropTypes.string,
};


PropertyImageGallery.defaultProps = {
  photoValue: null,
  address: "",
};


export default PropertyImageGallery;