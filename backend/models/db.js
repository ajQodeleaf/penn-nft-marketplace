const mongoose = require("mongoose");

const mongo_url = process.env.MONGO_DB_URL;

mongoose
  .connect(mongo_url)
  .then(() => {
    console.log("Database Connected!");
  })
  .catch((error) => {
    console.error(`Mongo DB Connection Error - ${error}`);
  });
