const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const passport = require('passport');
const connectDB = require('./config/db');

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Passport middleware for OAuth:
app.use(passport.initialize());
require('./config/passport')(passport);

// Routes:
app.use('/api/spreadsheet', require('./routes/spreadsheetRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Create a single server instance for both Express and Socket.IO
const server = createServer(app);

// Setup Socket.IO on the same server instance
const io = new Server(server, {
    cors: {
        origin: "*",  // Replace with your frontend's URL
        methods: ["GET", "POST"]
    }
});
app.use(cors());


// Socket.IO Setup
require('./sockets')(io);

// Define the single port for the application
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
