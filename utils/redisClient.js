const redis = require('redis');
const { redisConfig } = require('../config/config');

const client = redis.createClient(redisConfig);

client.on('error', (err) => console.error('Redis Client Error', err));

client.connect().catch((err) => console.error('Redis Connection Error', err));

module.exports = client;
