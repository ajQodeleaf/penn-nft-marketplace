module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define(
    "Collection",
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
          len: [3, 100],
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      metadataURI: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: true,
        },
      },
      price: {
        type: DataTypes.DECIMAL(18, 8),
        allowNull: true,
      },
      isListed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      contractAddress: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          is: /^0x[a-fA-F0-9]{40}$/,
        },
      },
      creatorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      tableName: "Collections",
      indexes: [
        { fields: ["creatorId"] },
        { fields: ["contractAddress"], unique: true },
      ],
    }
  );

  Collection.beforeCreate((collection) => {
    collection.contractAddress = collection.contractAddress.toLowerCase();
    collection.metadataURI = collection.metadataURI.toLowerCase();
  });

  Collection.associate = (models) => {
    Collection.belongsTo(models.User, {
      foreignKey: "creatorId",
      as: "creator",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    Collection.hasMany(models.NFT, {
      foreignKey: "collectionId",
      as: "nfts",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    });
  };

  return Collection;
};
