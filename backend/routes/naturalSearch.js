const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const nodeFetch = require("node-fetch");
const https = require("https");

const validatePropertyFilters =
  require("../utils/validatePropertyFilters");

const searchProperties =
  require("../services/propertySearch");

const router = express.Router();

const httpsAgent = new https.Agent({
  family: 4,
});

// Polyfill the Web Fetch API globals that the Anthropic SDK expects.
globalThis.fetch = nodeFetch;
globalThis.Headers = nodeFetch.Headers;
globalThis.Request = nodeFetch.Request;
globalThis.Response = nodeFetch.Response;

const fetchIPv4 = (url, options = {}) => {
  return nodeFetch(url, {
    ...options,
    agent: httpsAgent,
  });
};

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  fetch: fetchIPv4,
});

const systemPrompt = `
You convert natural-language real estate searches
into structured property filters.

Return EXACTLY one JSON object.

IMPORTANT:
- Return ONLY raw valid JSON.
- Do NOT use markdown code fences.
- Do NOT write \`\`\`json.
- Do NOT include explanations or prose.
- Do NOT include any text before or after the JSON object.

Return exactly this schema:

{
  "city": string | null,
  "zipcode": string | null,
  "minPrice": number | null,
  "maxPrice": number | null,
  "beds": integer | null,
  "baths": number | null,
  "minYearBuilt": integer | null,
  "maxYearBuilt": integer | null
}
`;


router.post("/", async (req, res) => {
  try {
    const { query } = req.body;

    if (
      typeof query !== "string" ||
      query.trim() === ""
    ) {
      return res.status(400).json({
        error:
          "Query must be a non-empty string.",
      });
    }

    let message;

    try {
      message =
        await anthropic.messages.create({
          model:
            "claude-sonnet-5",
          max_tokens: 1024,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: query.trim(),
            },
          ],
        });
    } catch (err) {
      console.error(
        "Anthropic API error:",
        err.message
      );
      console.error("Anthropic API error details:", {
        name: err.name,
        message: err.message,
        status: err.status,
        code: err.code,
        cause: err.cause,
      });

      return res.status(503).json({
        error:
          "Natural language search is temporarily unavailable.",
      });
    }

    const text =
      message.content?.[0]?.text;

    if (!text) {
      return res.status(503).json({
        error:
          "Natural language search returned an invalid response.",
      });
    }

    let extracted;

    try {
    let cleanedText = text.trim();

    cleanedText = cleanedText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/, "")
        .trim();

    extracted = JSON.parse(cleanedText);
    } catch (err) {
    console.error(
        "Failed to parse Claude response:",
        err.message
    );

    console.error(
        "Raw Claude response:",
        text
    );

    return res.status(503).json({
        error:
        "Natural language search returned invalid JSON.",
    });
    }

    const filters =
      validatePropertyFilters(extracted);

    if (
      Object.keys(filters).length === 0
    ) {
      return res.status(200).json({
        message:
          "I could not identify any supported property filters from that search.",
        interpretedFilters: {},
        total: 0,
        limit: 20,
        offset: 0,
        results: [],
      });
    }

    const searchResult =
      await searchProperties({
        ...filters,
        limit: 20,
        offset: 0,
      });

    return res.json({
      query: query.trim(),
      interpretedFilters: filters,
      ...searchResult,
    });
  } catch (err) {
    console.error(
      "Natural search failed:",
      err.message
    );

    res.status(500).json({
      error:
        "Failed to perform natural language search.",
    });
  }
});

module.exports = router;