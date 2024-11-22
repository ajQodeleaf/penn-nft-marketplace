module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define("Collection", {
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
      allowNull: true,
    },
    contractAddress: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Collection.associate = (models) => {
    Collection.belongsTo(models.User, {
      foreignKey: "creatorId",
      as: "creator",
    });
  };

  return Collection;
};
