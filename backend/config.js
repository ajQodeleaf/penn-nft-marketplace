require("dotenv").config();

module.exports = {
  dbUser: process.env.DB_USERNAME,
  dbHost: process.env.DB_HOSTNAME,
  dbInitial: process.env.DB_INITIAL,
  dbName: process.env.DB_NFT_MARKETPLACE,
  dbPassword: process.env.DB_PASSWORD,
  dbPort: process.env.DB_PORT,
  port: process.env.SERVER_PORT || 4000,
};
