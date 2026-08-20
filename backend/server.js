require("dotenv").config();

const naturalSearchRouter = require("./routes/naturalSearch");
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const propertiesRouter = require("./routes/properties");
const logger = require("./middleware/logger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.use("/api/properties", propertiesRouter);

app.use(
  "/api/search/natural",
  naturalSearchRouter
);

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (err) {
    console.error("Database health check failed:", err.message);

    res.status(500).json({
      status: "error",
      database: "unreachable",
      message: err.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);