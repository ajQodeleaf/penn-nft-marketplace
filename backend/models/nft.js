module.exports = (sequelize, DataTypes) => {
  const NFT = sequelize.define("NFT", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    metadataURI: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nftContract: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  NFT.associate = (models) => {
    NFT.belongsTo(models.User, { foreignKey: "sellerId", as: "seller" });
    NFT.hasMany(models.Transaction, {
      foreignKey: "nftId",
      as: "transactions",
    });
  };

  return NFT;
};
