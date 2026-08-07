import {
    useEffect,
    useState,
  } from "react";
  
  import "./PropertyImageGallery.css";
  
  
  function parsePhotos(photoValue) {
    if (!photoValue) {
      return [];
    }
  
    try {
      const photos =
        typeof photoValue === "string"
          ? JSON.parse(photoValue)
          : photoValue;
  
      if (!Array.isArray(photos)) {
        return [];
      }
  
      return photos.filter(
        (photo) =>
          typeof photo === "string" &&
          photo.trim() !== ""
      );
    } catch {
      return [];
    }
  }
  
  
  function PropertyImageGallery({
    photoValue,
    address,
  }) {
    const photos = parsePhotos(photoValue);
  
    const [selectedIndex, setSelectedIndex] =
      useState(0);
  
    const [lightboxOpen, setLightboxOpen] =
      useState(false);
  
  
    function previousPhoto() {
      setSelectedIndex((current) =>
        current === 0
          ? photos.length - 1
          : current - 1
      );
    }
  
  
    function nextPhoto() {
      setSelectedIndex((current) =>
        current === photos.length - 1
          ? 0
          : current + 1
      );
    }
  
  
    useEffect(() => {
      if (!lightboxOpen) {
        return;
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
    }, [lightboxOpen, photos.length]);
  
  
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
              onClick={() =>
                setLightboxOpen(false)
              }
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
  
  export default PropertyImageGallery;