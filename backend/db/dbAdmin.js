const { Pool } = require("pg");
const { dbUser, dbHost, dbPassword, dbPort, dbInitial } = require("../config");

const ensureDatabaseExists = async (dbName) => {
  const adminPool = new Pool({
    user: dbUser,
    host: dbHost,
    database: dbInitial,
    password: dbPassword,
    port: dbPort,
  });

  try {
    const dbCheckQuery = `SELECT 1 FROM pg_database WHERE datname = $1;`;
    const dbCheckResult = await adminPool.query(dbCheckQuery, [dbName]);

    if (dbCheckResult.rows.length === 0) {
      console.log(`Database "${dbName}" does not exist. Creating it...`);
      await adminPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created successfully!`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error("Error checking/creating database:", error.message);
    throw error;
  } finally {
    await adminPool.end();
  }
};

module.exports = { ensureDatabaseExists };
