const { Pool } = require("pg");
const { dbUser, dbHost, dbPassword, dbPort, dbName } = require("../config");

const initializeDatabase = async () => {
  const appPool = new Pool({
    user: dbUser,
    host: dbHost,
    database: dbName,
    password: dbPassword,
    port: dbPort,
  });

  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS Users (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100),
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS NFTs (
        id SERIAL PRIMARY KEY,
        seller_id INT REFERENCES Users(id) ON DELETE CASCADE,
        nft_contract VARCHAR(255) NOT NULL,
        token_id BIGINT NOT NULL,
        price NUMERIC(18, 8) NOT NULL,
        metadata_uri TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await appPool.query(createTablesQuery);
    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error.message);
  } finally {
    await appPool.end();
  }
};

module.exports = { initializeDatabase };
