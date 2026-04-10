const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*', methods: ['GET', 'POST', 'PUT'] }
});

connectDB();

app.use(cors());
app.use(express.json({ extended: false }));

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
