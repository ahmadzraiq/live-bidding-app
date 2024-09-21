-- Create the database
CREATE DATABASE IF NOT EXISTS auction_db;
USE auction_db;

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) NOT NULL PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255)
);

-- Create the auctions table
CREATE TABLE IF NOT EXISTS auctions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL
);

-- Create the bids table
CREATE TABLE IF NOT EXISTS bids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  auction_id INT NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  timestamp DATETIME NOT NULL,
  FOREIGN KEY (auction_id) REFERENCES auctions(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Add indexes for performance
CREATE INDEX idx_bids_auction_id ON bids (auction_id);
CREATE INDEX idx_bids_user_id ON bids (user_id);
