const Sequelize = require('sequelize');

const sequelize = require('../config/database');

const City = sequelize.define('city', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  postalCode: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
      type: Sequelize.STRING,
      allowNull: false
  },
  abbreviation: {
    type: Sequelize.STRING(5),
    allowNull: false
  }
}, 
{
  underscored: true, // Convert camelCase to camel_case
  freezeTableName: true, // Let table name be in singular
});

module.exports = City;