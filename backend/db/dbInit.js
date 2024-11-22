const pool = require("./pool");

const initDB = async () => {
  try {
    const usersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(usersTableQuery);
    console.log("Users table created successfully");

    const collectionsTableQuery = `
      CREATE TABLE IF NOT EXISTS collections (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        contract_address VARCHAR(255) UNIQUE NOT NULL,
        creator_id INT REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(collectionsTableQuery);
    console.log("Collections table created successfully");

    const nftsTableQuery = `
      CREATE TABLE IF NOT EXISTS nfts (
        id SERIAL PRIMARY KEY,
        seller_id INT REFERENCES users(id) ON DELETE CASCADE,
        nft_contract VARCHAR(255) NOT NULL,
        token_id VARCHAR(255) NOT NULL,
        price DECIMAL(18, 4) NOT NULL,
        metadata_uri VARCHAR(255),
        description TEXT, -- Added description field
        verified BOOLEAN DEFAULT FALSE, -- Added verified field
        listed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(nftsTableQuery);
    console.log("NFTs table created successfully");

    const transactionsTableQuery = `
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        nft_id INT REFERENCES nfts(id) ON DELETE CASCADE,
        buyer_id INT REFERENCES users(id) ON DELETE CASCADE,
        seller_id INT REFERENCES users(id) ON DELETE CASCADE,
        value DECIMAL(18, 4) NOT NULL,
        transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(transactionsTableQuery);
    console.log("Transactions table created successfully");

    const tradingHistoryTableQuery = `
      CREATE TABLE IF NOT EXISTS trading_history (
        id SERIAL PRIMARY KEY,
        nft_id INT REFERENCES nfts(id) ON DELETE CASCADE,
        price DECIMAL(18, 4) NOT NULL,
        buyer_id INT REFERENCES users(id) ON DELETE CASCADE,
        seller_id INT REFERENCES users(id) ON DELETE CASCADE,
        transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(tradingHistoryTableQuery);
    console.log("Trading history table created successfully");

    console.log("All tables have been successfully initialized");
  } catch (error) {
    console.error("Error initializing the database:", error);
    process.exit(1);
  }
};

initDB();
