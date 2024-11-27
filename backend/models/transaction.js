module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      value: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: false,
        validate: {
          min: 0.0,
        },
      },
      nftId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      collectionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "Transactions",
      indexes: [
        { fields: ["buyerId"] },
        { fields: ["sellerId"] },
        { fields: ["nftId"] },
        { fields: ["collectionId"] },
      ],
    }
  );

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: "buyerId",
      as: "buyer",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
    Transaction.belongsTo(models.User, {
      foreignKey: "sellerId",
      as: "seller",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
    Transaction.belongsTo(models.NFT, {
      foreignKey: "nftId",
      as: "nft",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
    Transaction.belongsTo(models.Collection, {
      foreignKey: "collectionId",
      as: "collection",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  };

  return Transaction;
};
