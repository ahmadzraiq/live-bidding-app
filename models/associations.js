const { User } = require('./userModel');
const { Auction } = require('./auctionModel');
const { Bid } = require('./bidModel');

// Associations
User.hasMany(Bid, { foreignKey: 'user_id' });
Bid.belongsTo(User, { foreignKey: 'user_id' });

Auction.hasMany(Bid, { foreignKey: 'auction_id' });
Bid.belongsTo(Auction, { foreignKey: 'auction_id' });

module.exports = {
  User,
  Auction,
  Bid,
};
