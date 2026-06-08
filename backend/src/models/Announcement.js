const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Announcement extends Model {
    static associate(models) {
    }
  }

  Announcement.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      body: { type: DataTypes.TEXT, allowNull: false },
      type: {
        type: DataTypes.ENUM('info', 'warning', 'urgent'),
        defaultValue: 'info',
      },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      createdBy: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: 'Announcement', timestamps: true }
  );

  return Announcement;
};