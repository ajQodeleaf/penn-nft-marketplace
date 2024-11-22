const express = require("express");
const { sequelize } = require("./models");
const { Client } = require("pg");
const errorHandler = require("./middleware/errorHandler");
const nftRoutes = require("./routes/routes");
require("dotenv").config();

const ensureDatabaseExists = async () => {
  const client = new Client({
    host: process.env.DB_HOSTNAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_INITIAL,
  });

  try {
    await client.connect();
    const dbName = process.env.DB_NFT_MARKETPLACE;

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (res.rows.length === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully.`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error("Error ensuring database existence:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

const startServer = async () => {
  try {
    await ensureDatabaseExists();

    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    await sequelize.sync({ alter: true });
    console.log("Models synchronized with the database.");

    const app = express();
    app.use(express.json());

    app.use("/api/", nftRoutes);

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
