module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define("Transaction", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    nftId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, { foreignKey: "buyerId", as: "buyer" });
    Transaction.belongsTo(models.User, {
      foreignKey: "sellerId",
      as: "seller",
    });
    Transaction.belongsTo(models.NFT, { foreignKey: "nftId", as: "nft" });
  };

  return Transaction;
};
