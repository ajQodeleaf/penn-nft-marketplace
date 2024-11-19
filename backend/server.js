const express = require("express");
const { ensureDatabaseExists } = require("./db/dbAdmin");
const { initializeDatabase } = require("./db/dbInit");
const errorHandler = require("./middleware/errorHandler");
const { dbName, port } = require("./config");
const nftRoutes = require("./routes/routes");

const startServer = async () => {
  await ensureDatabaseExists(dbName);

  await initializeDatabase();

  const app = express();
  app.use(express.json());

  app.use("/api/nfts", nftRoutes);

  app.use(errorHandler);

  const PORT = port || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
