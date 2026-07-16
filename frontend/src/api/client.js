export async function fetchProperties(params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `/api/properties?${query}` : "/api/properties";
  
    const response = await fetch(url);
  
    if (!response.ok) {
      let message = "Failed to fetch properties";
  
      try {
        const errorData = await response.json();
        message = errorData.error || errorData.message || message;
      } catch {
        // Keep the default message if the response is not JSON.
      }
  
      throw new Error(message);
    }
  
    return response.json();
  }