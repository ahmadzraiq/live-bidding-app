const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const apiRoutes = require('./routes/apiRoutes');
const { socketHandler } = require('./sockets/socketHandlers');
const { initializeAuctions } = require('./utils/initializeData');
const sequelize = require('./models/sequelize');
require('./models/associations'); // Ensure associations are set up

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Use API routes
app.use('/api', apiRoutes);

// Handle Socket.IO connections
io.on('connection', (socket) => {
  socketHandler(io, socket);
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  // Test the database connection
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Initialize auctions if needed
    await initializeAuctions();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
