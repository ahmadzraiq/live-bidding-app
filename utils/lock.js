const redisClient = require('./redisClient');

async function acquireLock(key, ttl) {
  const value = (Date.now() + ttl + 1).toString();
  const result = await redisClient.set(key, value, { NX: true, PX: ttl });
  if (result === 'OK') {
    return value;
  }

  const currentValue = await redisClient.get(key);
  if (currentValue && parseInt(currentValue) < Date.now()) {
    const oldValue = await redisClient.getSet(key, value);
    if (oldValue === currentValue) {
      await redisClient.pexpire(key, ttl);
      return value;
    }
  }

  return null;
}

async function releaseLock(key, value) {
  const currentValue = await redisClient.get(key);
  if (currentValue === value) {
    await redisClient.del(key);
  }
}

module.exports = {
  acquireLock,
  releaseLock,
};
