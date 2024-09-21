const express = require('express');
const router = express.Router();
const { fetchAvailableAuctions } = require('../controllers/auctionController');

router.get('/auctions', fetchAvailableAuctions);

module.exports = router;
