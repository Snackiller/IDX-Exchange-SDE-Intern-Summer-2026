import { fetchProperties } from "./client";

describe("fetchProperties", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("returns property data when the request succeeds", async () => {
    const mockData = {
      total: 1,
      limit: 20,
      offset: 0,
      results: [
        {
          L_ListingID: "123",
          L_City: "Beverly Hills",
        },
      ],
    };

    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const result = await fetchProperties({
      city: "Beverly Hills",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/properties?city=Beverly+Hills"
    );

    expect(result).toEqual(mockData);
  });

  test("does not include empty parameters in the URL", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        total: 0,
        results: [],
      }),
    });

    await fetchProperties({
      city: "Portland",
      zipcode: "",
      beds: "",
    });

    expect(global.fetch).toHaveBeenCalledWith(
      "/api/properties?city=Portland"
    );
  });

  test("throws a meaningful error for a failed request", async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({
        error: "Invalid minimum price",
      }),
    });

    await expect(
      fetchProperties({ minPrice: "abc" })
    ).rejects.toThrow("Invalid minimum price");
  });
});