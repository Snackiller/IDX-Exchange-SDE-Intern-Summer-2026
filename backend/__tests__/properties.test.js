const request = require("supertest");

jest.mock("../db", () => ({
  query: jest.fn(),
}));

const pool = require("../db");
const app = require("../app");


describe("GET /api/properties", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns properties with default pagination", async () => {
    pool.query
      .mockResolvedValueOnce([
        [{ total: 2 }],
      ])
      .mockResolvedValueOnce([
        [
          {
            L_ListingID: "1",
            L_City: "Portland",
          },
          {
            L_ListingID: "2",
            L_City: "Portland",
          },
        ],
      ]);

    const response = await request(app)
      .get("/api/properties");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      total: 2,
      limit: 20,
      offset: 0,
      results: [
        {
          L_ListingID: "1",
          L_City: "Portland",
        },
        {
          L_ListingID: "2",
          L_City: "Portland",
        },
      ],
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
  });


  test("supports pagination parameters", async () => {
    pool.query
      .mockResolvedValueOnce([
        [{ total: 100 }],
      ])
      .mockResolvedValueOnce([
        [],
      ]);

    const response = await request(app)
      .get(
        "/api/properties?limit=10&offset=20"
      );

    expect(response.status).toBe(200);
    expect(response.body.limit).toBe(10);
    expect(response.body.offset).toBe(20);

    expect(
      pool.query.mock.calls[1][1]
    ).toEqual([10, 20]);
  });


  test("applies a city filter", async () => {
    pool.query
      .mockResolvedValueOnce([
        [{ total: 1 }],
      ])
      .mockResolvedValueOnce([
        [
          {
            L_ListingID: "10",
            L_City: "Portland",
          },
        ],
      ]);

    const response = await request(app)
      .get(
        "/api/properties?city=Portland"
      );

    expect(response.status).toBe(200);

    expect(
      pool.query.mock.calls[0][0]
    ).toContain(
      "L_City = ?"
    );

    expect(
      pool.query.mock.calls[0][1]
    ).toEqual(["Portland"]);
  });


  test("applies zipcode filter", async () => {
    pool.query
      .mockResolvedValueOnce([
        [{ total: 0 }],
      ])
      .mockResolvedValueOnce([
        [],
      ]);

    const response = await request(app)
      .get(
        "/api/properties?zipcode=97201"
      );

    expect(response.status).toBe(200);

    expect(
      pool.query.mock.calls[0][0]
    ).toContain("L_Zip = ?");

    expect(
      pool.query.mock.calls[0][1]
    ).toEqual(["97201"]);
  });


  test("applies price filters", async () => {
    pool.query
      .mockResolvedValueOnce([
        [{ total: 0 }],
      ])
      .mockResolvedValueOnce([
        [],
      ]);

    const response = await request(app)
      .get(
        "/api/properties?minPrice=300000&maxPrice=800000"
      );

    expect(response.status).toBe(200);

    expect(
      pool.query.mock.calls[0][0]
    ).toContain("L_SystemPrice >= ?");

    expect(
      pool.query.mock.calls[0][0]
    ).toContain("L_SystemPrice <= ?");

    expect(
      pool.query.mock.calls[0][1]
    ).toEqual([
      300000,
      800000,
    ]);
  });


  test("applies beds and baths filters", async () => {
    pool.query
      .mockResolvedValueOnce([
        [{ total: 0 }],
      ])
      .mockResolvedValueOnce([
        [],
      ]);

    const response = await request(app)
      .get(
        "/api/properties?beds=3&baths=2"
      );

    expect(response.status).toBe(200);

    expect(
      pool.query.mock.calls[0][0]
    ).toContain("L_Keyword2 >= ?");

    expect(
      pool.query.mock.calls[0][0]
    ).toContain("LM_Dec_3 >= ?");

    expect(
      pool.query.mock.calls[0][1]
    ).toEqual([3, 2]);
  });


  test("rejects invalid minPrice", async () => {
    const response = await request(app)
      .get(
        "/api/properties?minPrice=abc"
      );

    expect(response.status).toBe(400);

    expect(response.body.error).toMatch(
      /Invalid minPrice/i
    );

    expect(pool.query).not.toHaveBeenCalled();
  });


  test("rejects invalid limit", async () => {
    const response = await request(app)
      .get(
        "/api/properties?limit=200"
      );

    expect(response.status).toBe(400);

    expect(response.body.error).toMatch(
      /Invalid limit/i
    );
  });
});


describe("GET /api/properties/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("returns a property by ID", async () => {
    const property = {
      L_ListingID: "123",
      L_Address: "123 Main St",
    };

    pool.query.mockResolvedValueOnce([
      [property],
    ]);

    const response = await request(app)
      .get("/api/properties/123");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(property);

    expect(
      pool.query
    ).toHaveBeenCalledWith(
      expect.stringContaining(
        "WHERE L_ListingID = ?"
      ),
      ["123"]
    );
  });


  test("returns 404 for an unknown property", async () => {
    pool.query.mockResolvedValueOnce([
      [],
    ]);

    const response = await request(app)
      .get("/api/properties/999999");

    expect(response.status).toBe(404);

    expect(response.body).toEqual({
      error: "Property not found",
    });
  });


  test("returns 400 for invalid property ID", async () => {
    const response = await request(app)
      .get(
        "/api/properties/not-valid"
      );

    expect(response.status).toBe(400);

    expect(response.body).toEqual({
      error: "Invalid listing ID",
    });

    expect(pool.query).not.toHaveBeenCalled();
  });
});


describe(
    "GET /api/properties/:id/openhouses",
    () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
  
      test("returns open houses for a property", async () => {
        const openHouses = [
          {
            L_ListingID: "123",
            OpenHouseDate: "2026-08-30",
          },
        ];
  
        // First query: confirm the property exists.
        pool.query.mockResolvedValueOnce([
          [{ L_ListingID: "123" }],
        ]);
  
        // Second query: return its open houses.
        pool.query.mockResolvedValueOnce([
          openHouses,
        ]);
  
        const response = await request(app)
          .get(
            "/api/properties/123/openhouses"
          );
  
        expect(response.status).toBe(200);
  
        expect(response.body).toEqual(
          openHouses
        );
  
        expect(pool.query).toHaveBeenCalledTimes(2);
      });
  
  
      test("returns an empty array when the property exists but has no open houses", async () => {
        // Property exists.
        pool.query.mockResolvedValueOnce([
          [{ L_ListingID: "123" }],
        ]);
  
        // But it has no open houses.
        pool.query.mockResolvedValueOnce([
          [],
        ]);
  
        const response = await request(app)
          .get(
            "/api/properties/123/openhouses"
          );
  
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
  
        expect(pool.query).toHaveBeenCalledTimes(2);
      });
  
  
      test("returns 404 when the property does not exist", async () => {
        // Property existence query returns no rows.
        pool.query.mockResolvedValueOnce([
          [],
        ]);
  
        const response = await request(app)
          .get(
            "/api/properties/999999/openhouses"
          );
  
        expect(response.status).toBe(404);
  
        expect(response.body).toEqual({
          error: "Property not found",
        });
  
        // It should stop before querying rets_openhouse.
        expect(pool.query).toHaveBeenCalledTimes(1);
      });
  
  
      test("returns 400 for an invalid listing ID", async () => {
        const response = await request(app)
          .get(
            "/api/properties/abc/openhouses"
          );
  
        expect(response.status).toBe(400);
  
        expect(response.body).toEqual({
          error: "Invalid listing ID",
        });
  
        expect(pool.query).not.toHaveBeenCalled();
      });
    }
);