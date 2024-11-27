module.exports = (sequelize, DataTypes) => {
  const NFT = sequelize.define(
    "NFT",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 100],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      metadataURI: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      price: {
        type: DataTypes.DECIMAL(38, 0),
        allowNull: false,
        validate: {
          isNumeric: true,
        },
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
        validate: {
          is: /^0x[a-fA-F0-9]{40}$/,
        },
      },
      tokenId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      collectionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      tableName: "NFTs",
      indexes: [
        { fields: ["sellerId"] },
        { fields: ["collectionId"] },
        { fields: ["nftContract", "tokenId"], unique: true },
      ],
    }
  );

  NFT.associate = (models) => {
    NFT.belongsTo(models.User, {
      foreignKey: "sellerId",
      as: "seller",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    NFT.belongsTo(models.Collection, {
      foreignKey: "collectionId",
      as: "collection",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });

    NFT.hasMany(models.Transaction, {
      foreignKey: "nftId",
      as: "transactions",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return NFT;
};
