const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const Reservation = sequelize.define('reservation', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  comment: {
    type: Sequelize.STRING,
    allowNull: false
  },
  reservedAt: {
    type: Sequelize.DATE,
    allowNull: false
  },
  isCancelledByUser: {
    type: Sequelize.BOOLEAN
  },
  isCancelledByUser: {
    type: Sequelize.BOOLEAN
  },
},
{
  underscored: true, // Convert camelCase to camel_case
  freezeTableName: true, // Let table name be in singular
});

module.exports = Reservation;