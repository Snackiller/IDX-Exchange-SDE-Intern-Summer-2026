export async function fetchProperties(params = {}) {
  // Only include non-empty query parameters.
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    )
  );

  const queryString = new URLSearchParams(cleanedParams).toString();

  const url = queryString
    ? `/api/properties?${queryString}`
    : "/api/properties";

  const response = await fetch(url);

  if (!response.ok) {
    let message = "Failed to fetch properties";

    try {
      const errorData = await response.json();
      message =
        errorData.error ||
        errorData.message ||
        message;
    } catch {
      // Use the default message when the response body is not JSON.
    }

    throw new Error(message);
  }

  return response.json();
}