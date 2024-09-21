const { Sequelize } = require('sequelize');
const { mysqlConfig } = require('../config/config');

const sequelize = new Sequelize(
  mysqlConfig.database,
  mysqlConfig.user,
  mysqlConfig.password,
  {
    host: mysqlConfig.host,
    dialect: mysqlConfig.dialect,
    logging: mysqlConfig.logging,
  }
);

module.exports = sequelize;
