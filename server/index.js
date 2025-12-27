// server/index.js
require('./config/loadEnv');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require("socket.io");

// Route files
const authRoutes = require('./routes/authRoutes');
const managerRoutes = require('./routes/managerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // --- 1. ADD THIS MISSING IMPORT ---

connectDB();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) { callback(null, true); } 
    else { callback(new Error('Not allowed by CORS')); }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Mount the routers
app.use('/api/auth', authRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // --- 2. ADD THIS MISSING ROUTE ---

// Socket.IO Logic
io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User with ID: ${socket.id} joined room: ${room}`);
    });

    socket.on("send_message", (data) => {
        io.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server and Socket.IO running on port ${PORT}`));