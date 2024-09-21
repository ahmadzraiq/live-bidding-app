const mysql = require('mysql2/promise');
const { mysqlConfig } = require('../config/config');

const dbPool = mysql.createPool(mysqlConfig);

module.exports = dbPool;
