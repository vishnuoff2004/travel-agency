const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.User, { foreignKey: 'organizerId' });
    }
  }

  Event.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      startDate: { type: DataTypes.DATE, allowNull: false },
      endDate: { type: DataTypes.DATE, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: true },
      organizerId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: 'Event', timestamps: true }
  );

  return Event;
};