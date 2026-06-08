module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    type: {
      type: DataTypes.ENUM('info', 'booking', 'alert'),
      defaultValue: 'info',
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read',
    },
  }, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'idx_notifications_user_created',
        fields: ['user_id', 'created_at'],
      },
      {
        name: 'idx_notifications_user_read',
        fields: ['user_id', 'is_read'],
      },
    ],
  });

  Notification.associate = (db) => {
    Notification.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });
  };

  return Notification;
};
