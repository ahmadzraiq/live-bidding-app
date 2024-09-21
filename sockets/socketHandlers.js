const { insertUser } = require('../models/userModel');
const { getAuctionById } = require('../models/auctionModel');
const { insertBid } = require('../models/bidModel');
const { acquireLock, releaseLock } = require('../utils/lock');
const { rateLimiter } = require('../utils/rateLimiter');
const redisClient = require('../utils/redisClient');

function socketHandler(io, socket) {
  console.log(`User connected: ${socket.id}`);

  // Generate a unique userId
  const userId = 'user_' + Math.floor(Math.random() * 1000);

  // Send the userId to the client
  socket.emit('userId', userId);

  // Insert the user into the database if not exists
  insertUser(userId).catch((err) => {
    console.error('Error inserting user:', err);
  });

  // User joins an auction room
  socket.on('joinAuction', async (auctionId) => {
    auctionId = parseInt(auctionId, 10);
    if (isNaN(auctionId)) {
      socket.emit('joinError', 'Invalid auction ID.');
      return;
    }

    try {
      const auction = await getAuctionById(auctionId);
      if (!auction) {
        socket.emit('joinError', 'Auction does not exist or has ended.');
        return;
      }
    } catch (err) {
      console.error('Error checking auction:', err);
      socket.emit('joinError', 'An error occurred while joining the auction.');
      return;
    }

    socket.join(`auction_${auctionId}`);
    console.log(`User ${userId} joined auction ${auctionId}`);

    // Emit a confirmation to the client
    socket.emit('joinedAuction');
  });

  // User places a bid
  socket.on('placeBid', async ({ auctionId, bidAmount }) => {
    auctionId = parseInt(auctionId, 10);
    bidAmount = parseFloat(bidAmount);

    if (isNaN(auctionId) || isNaN(bidAmount) || bidAmount <= 0) {
      socket.emit('bidError', 'Invalid bid data.');
      return;
    }

    // Rate limiting
    const rateLimitExceeded = await rateLimiter(redisClient, userId);
    if (rateLimitExceeded) {
      socket.emit('bidError', 'Rate limit exceeded. Please wait before bidding again.');
      return;
    }

    // Process the bid
    await processBid(io, socket, auctionId, userId, bidAmount);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
}

async function processBid(io, socket, auctionId, userId, bidAmount) {
  const redisLockKey = `auction_lock_${auctionId}`;
  const lockValue = await acquireLock(redisLockKey, 5000); // 5 seconds TTL

  if (!lockValue) {
    socket.emit('bidError', 'Could not acquire lock, please try again.');
    return;
  }

  try {
    // Check if auction exists and hasn't ended
    const auction = await getAuctionById(auctionId);
    if (!auction) {
      socket.emit('bidError', 'Auction does not exist or has ended.');
      return;
    }

    // Get current highest bid from Redis
    let highestBid = await redisClient.get(`highest_bid_${auctionId}`);
    highestBid = highestBid ? parseFloat(highestBid) : 0;

    // Validate bid amount
    if (bidAmount <= highestBid) {
      socket.emit('bidError', 'Bid must be higher than the current highest bid.');
      return;
    }

    // Insert bid into the database
    await insertBid(auctionId, userId, bidAmount);

    // Update highest bid in Redis
    await redisClient.set(`highest_bid_${auctionId}`, bidAmount);

    // Broadcast new highest bid to all clients in the auction room
    io.to(`auction_${auctionId}`).emit('newHighestBid', { userId, bidAmount });
    console.log(`User ${userId} placed a bid of $${bidAmount} on auction ${auctionId}`);
  } catch (err) {
    console.error('Error in processBid:', err);
    socket.emit('bidError', 'An error occurred while processing your bid.');
  } finally {
    // Release Redis lock
    await releaseLock(redisLockKey, lockValue);
  }
}

module.exports = {
  socketHandler,
};
