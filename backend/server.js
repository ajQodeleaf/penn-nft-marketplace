const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const nftRoutes = require("./routes/routes");
require("dotenv").config();
require("./models/db");

const startServer = async () => {
  try {
    const app = express();

    const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];

    app.use((req, res, next) => {
      console.log("Incoming Origin:", req.headers.origin);
      console.log("Request URL:", req.url);
      console.log("Request Method:", req.method);
      next();
    });

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            console.error(`Blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
        credentials: true,
      })
    );

    app.options("*", (req, res) => {
      res.header(
        "Access-Control-Allow-Origin",
        allowedOrigins.includes(req.headers.origin)
          ? req.headers.origin
          : allowedOrigins[0]
      );
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, Origin, Accept"
      );
      res.header("Access-Control-Allow-Credentials", "true");
      res.sendStatus(200);
    });

    app.use(express.json());

    app.use("/api", nftRoutes);

    app.get("/api/", (req, res) => {
      res.send("CORS is working properly. Welcome to NFT Marketplace!");
    });

    app.use(errorHandler);

    const PORT = process.env.SERVER_PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing the server:", error.message, error.stack);
    process.exit(1);
  }
};

startServer();
