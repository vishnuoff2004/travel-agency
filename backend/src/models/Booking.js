const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'userId' });
      Booking.belongsTo(models.Route, { foreignKey: 'routeId' });
      Booking.belongsTo(models.Driver, { foreignKey: 'driverId' });
      Booking.hasMany(models.BookingStatusHistory, { foreignKey: 'bookingId' });
    }
  }

  Booking.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      routeId: { type: DataTypes.INTEGER, allowNull: false },
      driverId: { type: DataTypes.INTEGER, allowNull: false },
      seatCount: { type: DataTypes.INTEGER, allowNull: false },
      travelDate: { type: DataTypes.DATEONLY, allowNull: false },
      status: {
        type: DataTypes.ENUM('Pending', 'Confirmed', 'On Trip', 'Completed', 'Cancelled'),
        defaultValue: 'Pending',
      },
      cancelReason: { type: DataTypes.STRING, allowNull: true },
      cancelledBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    { sequelize, modelName: 'Booking', timestamps: true }
  );

  return Booking;
};
