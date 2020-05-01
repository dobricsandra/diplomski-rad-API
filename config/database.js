const Sequelize = require('sequelize');

// This is very tricky. Make sure to enable TCP/IP in Sql Server Configuration Manager 
const sequelize = new Sequelize('seq_keep-up.hr', 'keep-up_user', 'korisnik', {
    dialect: 'mssql',
    host: 'DESKTOP-HDHA5VF',
    dialectOptions: {
      // Observe the need for this nested `options` field for MSSQL
      options: {
        // Your tedious options here
        instanceName: 'SQLEXPRESS',
      }
    }
  });
module.exports = sequelize;

