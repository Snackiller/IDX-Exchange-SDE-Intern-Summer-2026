export function parsePhotos(photoValue) {
    if (!photoValue) {
      return [];
    }
  
    try {
      // RETS photo data may arrive either as an already-parsed array or
      // as a JSON string, so normalize both formats before components use it.
      const photos =
        typeof photoValue === "string"
          ? JSON.parse(photoValue)
          : photoValue;
  
      if (!Array.isArray(photos)) {
        return [];
      }
  
      // Remove malformed and empty entries here so gallery components can
      // render the returned array without repeating defensive validation.
      return photos.filter(
        (photo) =>
          typeof photo === "string" &&
          photo.trim() !== ""
      );
    } catch {
      // Invalid source photo data should degrade to an empty gallery rather
      // than causing JSON parsing errors to crash the property UI.
      return [];
    }
}