export function parsePhotos(photoValue) {
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