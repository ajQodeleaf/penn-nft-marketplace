const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const nftRoutes = require("./routes/routes");
require("dotenv").config();
require("./models/db");

const startServer = async () => {
  try {
    const app = express();

    app.use((req, res, next) => {
      console.log("Incoming Origin:", req.headers.origin);
      next();
    });
    console.log("Frontend URL:- ", process.env.FRONTEND_URL);

    const allowedOrigins = [
      "http://localhost:3000",
      "https://penn-nft-marketplace-aywl.vercel.app/api",
      "https://penn-nft-marketplace-aywl-aradhya-jains-projects.vercel.app/api",
      `${process.env.FRONTEND_URL}/api`,
    ];

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
        credentials: true,
      })
    );

    app.options("*", cors());

    app.use(express.json());

    app.use("/api", nftRoutes);

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
