const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
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

const User = require("./user")(sequelize, DataTypes);
const NFT = require("./nft")(sequelize, DataTypes);
const Transaction = require("./transaction")(sequelize, DataTypes);
const Collection = require("./collection")(sequelize, DataTypes);

User.associate({ NFT, Transaction, Collection });
NFT.associate({ User, Transaction });
Transaction.associate({ User, NFT });
Collection.associate({ User });

module.exports = { sequelize, User, NFT, Transaction, Collection };
