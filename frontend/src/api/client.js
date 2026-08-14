export async function fetchProperties(params = {}) {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    )
  );

  const queryString =
    new URLSearchParams(cleanedParams).toString();

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
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}


// Fetch one property by listing ID.
export async function fetchPropertyDetail(id) {
  const response = await fetch(
    `/api/properties/${id}`
  );

  if (!response.ok) {
    let message = "Failed to fetch property";

    try {
      const errorData = await response.json();

      message =
        errorData.error ||
        errorData.message ||
        message;
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}


// Fetch open houses for one property.
export async function fetchOpenHouses(id) {
  const response = await fetch(
    `/api/properties/${id}/openhouses`
  );

  if (!response.ok) {
    let message = "Failed to fetch open houses";

    try {
      const errorData = await response.json();

      message =
        errorData.error ||
        errorData.message ||
        message;
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}

export async function searchPropertiesNatural(
  query
) {
  const response = await fetch(
    "/api/search/natural",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        query,
      }),
    }
  );

  if (!response.ok) {
    let message =
      "Failed to perform natural language search";

    try {
      const errorData =
        await response.json();

      message =
        errorData.error ||
        errorData.message ||
        message;
    } catch {
      // Keep default message.
    }

    throw new Error(message);
  }

  return response.json();
}