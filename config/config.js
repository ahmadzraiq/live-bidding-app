module.exports = {
    mysqlConfig: {
      host: '127.0.0.1',
      user: 'root',
      password: 'root', // Replace with your MySQL password
      database: 'auction_db',
      dialect: 'mysql',
      logging: false, // Set to true for debugging
    },
    redisConfig: {
      host: '127.0.0.1',
      port: 6379,
    },
  };
  