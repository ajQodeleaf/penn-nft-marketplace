const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOSTNAME,
  DB_NFT_MARKETPLACE,
  NODE_ENV,
} = process.env;

const isProduction = NODE_ENV === "production";

const DATABASE_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOSTNAME}/${DB_NFT_MARKETPLACE}`;

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
});

const models = {
  User: require("./user")(sequelize, DataTypes),
  NFT: require("./nft")(sequelize, DataTypes),
  Transaction: require("./transaction")(sequelize, DataTypes),
  Collection: require("./collection")(sequelize, DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, ...models };
