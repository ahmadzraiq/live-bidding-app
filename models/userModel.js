const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
    },
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

async function insertUser(userId) {
  try {
    await User.findOrCreate({
      where: { id: userId },
      defaults: { id: userId },
    });
    console.log(`User ${userId} inserted into database.`);
  } catch (err) {
    console.error('Error inserting user:', err);
    throw err;
  }
}

module.exports = {
  User,
  insertUser,
};
