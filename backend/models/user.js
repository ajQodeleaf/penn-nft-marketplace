module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      walletAddress: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          is: /^0x[a-fA-F0-9]{40}$/i,
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 50],
        },
      },
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "Users",
    }
  );

  User.beforeCreate((user) => {
    user.walletAddress = user.walletAddress.toLowerCase();
  });

  User.beforeUpdate((user) => {
    user.walletAddress = user.walletAddress.toLowerCase();
  });

  User.associate = (models) => {
    User.hasMany(models.NFT, {
      foreignKey: "sellerId",
      as: "nfts",
    });

    User.hasMany(models.Transaction, {
      foreignKey: "buyerId",
      as: "transactions",
    });
  };

  return User;
};
