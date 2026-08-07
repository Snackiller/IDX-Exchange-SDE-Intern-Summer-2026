import "./PropertyMap.css";

function PropertyMap({
  latitude,
  longitude,
}) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  const hasValidLocation =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat !== 0 &&
    lng !== 0;

  if (!hasValidLocation) {
    return null;
  }

  const apiKey =
    process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <p className="property-map__error">
        Map unavailable: Google Maps API key
        is not configured.
      </p>
    );
  }

  const mapUrl =
    `https://www.google.com/maps/embed/v1/place` +
    `?key=${encodeURIComponent(apiKey)}` +
    `&q=${lat},${lng}` +
    `&zoom=15`;

  const directionsUrl =
    `https://www.google.com/maps/dir/` +
    `?api=1&destination=${lat},${lng}`;

  return (
    <section className="property-map">
      <h2>Location</h2>

      <iframe
        title="Property location"
        src={mapUrl}
        width="100%"
        height="400"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />

      <a
        className="property-map__directions"
        href={directionsUrl}
        target="_blank"
        rel="noreferrer"
      >
        Get Directions
      </a>
    </section>
  );
}

export default PropertyMap;