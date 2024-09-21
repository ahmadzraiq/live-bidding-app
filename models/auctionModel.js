const { DataTypes, Op } = require('sequelize');
const sequelize = require('./sequelize');

const Auction = sequelize.define(
  'Auction',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING(255),
    description: DataTypes.TEXT,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
  },
  {
    tableName: 'auctions',
    timestamps: false,
  }
);

async function getAvailableAuctions() {
  try {
    const auctions = await Auction.findAll({
      where: {
        end_time: {
          [Op.gt]: new Date(),
        },
      },
      attributes: ['id', 'title'],
    });
    return auctions;
  } catch (err) {
    console.error('Error fetching auctions:', err);
    throw err;
  }
}

async function getAuctionById(auctionId) {
  try {
    const auction = await Auction.findOne({
      where: {
        id: auctionId,
        end_time: {
          [Op.gt]: new Date(),
        },
      },
    });
    return auction;
  } catch (err) {
    console.error('Error fetching auction:', err);
    throw err;
  }
}

async function initializeAuctions() {
  try {
    const count = await Auction.count();
    if (count === 0) {
      await Auction.bulkCreate([
        {
          title: 'Antique Vase',
          description: 'A beautiful antique vase.',
          start_time: new Date(),
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000), // +1 day
        },
        {
          title: 'Vintage Watch',
          description: 'A classic vintage watch.',
          start_time: new Date(),
          end_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // +2 days
        },
        {
          title: 'Art Painting',
          description: 'An exquisite piece of art.',
          start_time: new Date(),
          end_time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 days
        },
      ]);
      console.log('Initial auctions inserted into database.');
    } else {
      console.log('Auctions already exist in the database.');
    }
  } catch (err) {
    console.error('Error initializing auctions:', err);
    throw err;
  }
}

module.exports = {
  Auction,
  getAvailableAuctions,
  getAuctionById,
  initializeAuctions,
};
