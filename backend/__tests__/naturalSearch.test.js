const express = require("express");
const request = require("supertest");

const mockCreate = jest.fn();

jest.mock(
  "@anthropic-ai/sdk",
  () =>
    jest.fn().mockImplementation(() => ({
      messages: {
        create: mockCreate,
      },
    }))
);

jest.mock(
  "../utils/validatePropertyFilters",
  () => jest.fn()
);

jest.mock(
  "../services/propertySearch",
  () => jest.fn()
);

const validatePropertyFilters =
  require("../utils/validatePropertyFilters");

const searchProperties =
  require("../services/propertySearch");

const naturalSearchRouter =
  require("../routes/naturalSearch");


function createTestApp() {
  const app = express();

  app.use(express.json());

  app.use(
    "/api/search/natural",
    naturalSearchRouter
  );

  return app;
}


describe("POST /api/search/natural", () => {
  let app;
  let consoleErrorSpy;

  beforeEach(() => {
    app = createTestApp();

    jest.clearAllMocks();

    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
  });


  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });


  test("returns 400 when query is missing", async () => {
    const response = await request(app)
      .post("/api/search/natural")
      .send({});

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error:
        "Query must be a non-empty string.",
    });

    expect(
      mockCreate
    ).not.toHaveBeenCalled();
  });


  test("returns 400 when query is empty", async () => {
    const response = await request(app)
      .post("/api/search/natural")
      .send({
        query: "   ",
      });

    expect(response.status).toBe(400);

    expect(response.body.error).toMatch(
      /non-empty string/i
    );

    expect(
      mockCreate
    ).not.toHaveBeenCalled();
  });


  test("returns property results for a valid natural language query", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          text: JSON.stringify({
            city: "Beverly Hills",
            zipcode: null,
            minPrice: null,
            maxPrice: 5000000,
            beds: 3,
            baths: null,
            minYearBuilt: null,
            maxYearBuilt: null,
          }),
        },
      ],
    });

    validatePropertyFilters.mockReturnValue({
      city: "Beverly Hills",
      maxPrice: 5000000,
      beds: 3,
    });

    searchProperties.mockResolvedValue({
      total: 2,
      limit: 20,
      offset: 0,
      results: [
        {
          L_ListingID: "123",
          L_City: "Beverly Hills",
        },
        {
          L_ListingID: "456",
          L_City: "Beverly Hills",
        },
      ],
    });

    const response = await request(app)
      .post("/api/search/natural")
      .send({
        query:
          "3 bedroom house in Beverly Hills under $5000000",
      });

    expect(response.status).toBe(200);

    expect(response.body.query).toBe(
      "3 bedroom house in Beverly Hills under $5000000"
    );

    expect(
      response.body.interpretedFilters
    ).toEqual({
      city: "Beverly Hills",
      maxPrice: 5000000,
      beds: 3,
    });

    expect(response.body.total).toBe(2);

    expect(response.body.results).toHaveLength(
      2
    );

    expect(
      searchProperties
    ).toHaveBeenCalledWith({
      city: "Beverly Hills",
      maxPrice: 5000000,
      beds: 3,
      limit: 20,
      offset: 0,
    });
  });


  test("removes markdown code fences from Claude response", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          text: `\`\`\`json
{
  "city": "Portland",
  "zipcode": null,
  "minPrice": null,
  "maxPrice": 700000,
  "beds": 2,
  "baths": null,
  "minYearBuilt": null,
  "maxYearBuilt": null
}
\`\`\``,
        },
      ],
    });

    validatePropertyFilters.mockReturnValue({
      city: "Portland",
      maxPrice: 700000,
      beds: 2,
    });

    searchProperties.mockResolvedValue({
      total: 1,
      limit: 20,
      offset: 0,
      results: [
        {
          L_ListingID: "789",
        },
      ],
    });

    const response = await request(app)
      .post("/api/search/natural")
      .send({
        query:
          "2 bedroom home in Portland under $700000",
      });

    expect(response.status).toBe(200);

    expect(
      validatePropertyFilters
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        city: "Portland",
        maxPrice: 700000,
        beds: 2,
      })
    );
  });


  test("returns a helpful response when no valid filters are extracted", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          text: JSON.stringify({
            city: null,
            zipcode: null,
            minPrice: null,
            maxPrice: null,
            beds: null,
            baths: null,
            minYearBuilt: null,
            maxYearBuilt: null,
          }),
        },
      ],
    });

    validatePropertyFilters.mockReturnValue(
      {}
    );

    const response = await request(app)
      .post("/api/search/natural")
      .send({
        query:
          "show me something interesting",
      });

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      message:
        "I could not identify any supported property filters from that search.",
      interpretedFilters: {},
      total: 0,
      limit: 20,
      offset: 0,
      results: [],
    });

    expect(
      searchProperties
    ).not.toHaveBeenCalled();
  });


  test("returns 503 when Anthropic API fails", async () => {
    mockCreate.mockRejectedValueOnce(
      new Error("Connection error")
    );

    const response = await request(app)
      .post("/api/search/natural")
      .send({
        query:
          "3 bedroom house in Portland",
      });

    expect(response.status).toBe(503);

    expect(response.body).toEqual({
      error:
        "Natural language search is temporarily unavailable.",
    });

    expect(
      searchProperties
    ).not.toHaveBeenCalled();
  });


  test("returns 503 when Claude response has no text", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [],
    });

    const response = await request(app)
      .post("/api/search/natural")
      .send({
        query:
          "3 bedroom house in Portland",
      });

    expect(response.status).toBe(503);

    expect(response.body).toEqual({
      error:
        "Natural language search returned an invalid response.",
    });

    expect(
      searchProperties
    ).not.toHaveBeenCalled();
  });


  test("returns 503 when Claude returns invalid JSON", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          text:
            "this is not valid JSON",
        },
      ],
    });

    const response = await request(app)
      .post("/api/search/natural")
      .send({
        query:
          "3 bedroom house in Portland",
      });

    expect(response.status).toBe(503);

    expect(response.body).toEqual({
      error:
        "Natural language search returned invalid JSON.",
    });

    expect(
      searchProperties
    ).not.toHaveBeenCalled();
  });


  test("returns 500 when property search fails unexpectedly", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          text: JSON.stringify({
            city: "Portland",
            zipcode: null,
            minPrice: null,
            maxPrice: null,
            beds: 3,
            baths: null,
            minYearBuilt: null,
            maxYearBuilt: null,
          }),
        },
      ],
    });

    validatePropertyFilters.mockReturnValue({
      city: "Portland",
      beds: 3,
    });

    searchProperties.mockRejectedValueOnce(
      new Error("Database error")
    );

    const response = await request(app)
      .post("/api/search/natural")
      .send({
        query:
          "3 bedroom house in Portland",
      });

    expect(response.status).toBe(500);

    expect(response.body).toEqual({
      error:
        "Failed to perform natural language search.",
    });
  });
});