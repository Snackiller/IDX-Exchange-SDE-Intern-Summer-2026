import { parsePhotos } from "./photoUtils";

describe("parsePhotos", () => {
  test("parses a valid JSON photo array", () => {
    const input = JSON.stringify([
      "https://example.com/1.jpg",
      "https://example.com/2.jpg",
    ]);

    expect(parsePhotos(input)).toEqual([
      "https://example.com/1.jpg",
      "https://example.com/2.jpg",
    ]);
  });

  test("returns an empty array for invalid JSON", () => {
    expect(parsePhotos("not valid json")).toEqual([]);
  });

  test("filters out empty or invalid photo values", () => {
    const input = [
      "https://example.com/1.jpg",
      "",
      "   ",
      null,
      123,
    ];

    expect(parsePhotos(input)).toEqual([
      "https://example.com/1.jpg",
    ]);
  });
});