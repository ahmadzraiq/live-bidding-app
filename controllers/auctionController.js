const { getAvailableAuctions } = require('../models/auctionModel');

async function fetchAvailableAuctions(req, res) {
  try {
    const auctions = await getAvailableAuctions();
    res.json(auctions);
  } catch (err) {
    console.error('Error fetching auctions:', err);
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
}

module.exports = {
  fetchAvailableAuctions,
};
