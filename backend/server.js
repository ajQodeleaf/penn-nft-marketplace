const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const nftRoutes = require("./routes/routes");
require("dotenv").config();
require("./models/db");

const startServer = async () => {
  try {
    const app = express();

    const allowedOrigins =
      process.env.NODE_ENV === "production"
        ? [process.env.PRODUCTION_FRONTEND_URL]
        : [process.env.DEVELOPMENT_FRONTEND_URL];

    if (process.env.NODE_ENV !== "production") {
      console.log("🌐 Allowed Origins:", allowedOrigins);
    }

    app.use((req, res, next) => {
      if (process.env.NODE_ENV !== "production") {
        console.log("🚀 Incoming Origin:", req.headers.origin);
        console.log("📄 Request URL:", req.url);
        console.log("⚙️ Request Method:", req.method);
      }
      next();
    });

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            console.error(`❌ Blocked by CORS: ${origin}`);
            callback(new Error("Not allowed by CORS"));
          }
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
        credentials: true,
      })
    );

    app.options("*", cors());

    app.use(express.json());

    app.use("/api", nftRoutes);

    app.get("/api/", (req, res) => {
      res.send("🎉 CORS is working properly. Welcome to NFT Marketplace!");
    });

    app.use(errorHandler);

    const PORT = process.env.SERVER_PORT || 5000;

    if (process.env.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`🌟 Server running on http://localhost:${PORT}`);
      });
    } else {
      app.listen(PORT, () => {
        console.log(
          `🚀 Server running in ${process.env.NODE_ENV} environment!`
        );
      });
    }
  } catch (error) {
    console.error(
      "❗ Error initializing the server:",
      error.message,
      error.stack
    );
    process.exit(1);
  }
};

startServer();
