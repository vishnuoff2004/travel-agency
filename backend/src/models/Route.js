const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    static associate(models) {
      Route.belongsTo(models.Driver, { foreignKey: 'driverId' });
    }
  }

  Route.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      driverId: { type: DataTypes.INTEGER, allowNull: false },
      source: { type: DataTypes.STRING, allowNull: false },
      destination: { type: DataTypes.STRING, allowNull: false },
      departureTime: { type: DataTypes.DATE, allowNull: false },
      arrivalTime: { type: DataTypes.DATE, allowNull: false },
      fare: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      capacity: { type: DataTypes.INTEGER, allowNull: false },
      available: { type: DataTypes.BOOLEAN, defaultValue: true },
    },
    { sequelize, modelName: 'Route', timestamps: true }
  );

  return Route;
};
