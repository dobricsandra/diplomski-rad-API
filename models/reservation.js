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
  isCancelledByUser: {
    type: Sequelize.INTEGER
  },
  isCancelledByInstructor: {
    type: Sequelize.INTEGER
  },
  cancelledTerm: {
    type: Sequelize.STRING(10),
    allowNull: true
  }
},
{
  underscored: true, // Convert camelCase to camel_case
  freezeTableName: true, // Let table name be in singular
});

module.exports = Reservation;