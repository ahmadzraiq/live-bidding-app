async function rateLimiter(redisClient, userId) {
    const rateLimitKey = `rate_limit_${userId}`;
    const currentCount = await redisClient.incr(rateLimitKey);
    if (currentCount === 1) {
      await redisClient.expire(rateLimitKey, 10); // 10 seconds window
    }
  
    return currentCount > 5;
  }
  
  module.exports = {
    rateLimiter,
  };
  