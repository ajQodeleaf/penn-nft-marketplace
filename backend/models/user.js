module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    walletAddress: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.NFT, { foreignKey: "sellerId", as: "nfts" });
    User.hasMany(models.Transaction, {
      foreignKey: "buyerId",
      as: "transactions",
    });
  };

  return User;
};
