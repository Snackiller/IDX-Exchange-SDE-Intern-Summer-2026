export function formatPrice(price) {
    const numericPrice = Number(price);
  
    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return "Price unavailable";
    }
  
    return numericPrice.toLocaleString(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }
    );
}