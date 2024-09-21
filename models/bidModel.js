const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Bid = sequelize.define(
  'Bid',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    auction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    amount: DataTypes.DECIMAL(10, 2),
    timestamp: DataTypes.DATE,
  },
  {
    tableName: 'bids',
    timestamps: false,
  }
);

async function insertBid(auctionId, userId, bidAmount) {
  try {
    await Bid.create({
      auction_id: auctionId,
      user_id: userId,
      amount: bidAmount,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error('Error inserting bid:', err);
    throw err;
  }
}

module.exports = {
  Bid,
  insertBid,
};
