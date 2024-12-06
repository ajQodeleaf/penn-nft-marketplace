const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const nftRoutes = require("./routes/routes");
require("dotenv").config();
require("./models/db");

const startServer = async () => {
  try {
    const app = express();

    app.use(cors({ origin: "http://localhost:3000" }));

    app.use(cors());

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
