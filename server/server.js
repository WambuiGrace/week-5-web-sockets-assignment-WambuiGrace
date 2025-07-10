// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users and messages
const users = {};
const messages = [];
const typingUsers = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle user joining
  socket.on('user_join', (username, room) => {
    users[socket.id] = { username, id: socket.id, room };
    socket.join(room);
    io.to(room).emit('user_list', Object.values(users).filter(u => u.room === room));
    socket.to(room).emit('user_joined', { username, id: socket.id });
    console.log(`${username} joined room ${room}`);
  });

  // Handle chat messages
  socket.on('send_message', (messageData) => {
    const user = users[socket.id];
    if (!user) return;

    const message = {
      ...messageData,
      id: Date.now(),
      sender: user.username,
      senderId: socket.id,
      timestamp: new Date().toISOString(),
      room: user.room,
    };
    
    messages.push(message);
    
    // Limit stored messages to prevent memory issues
    if (messages.length > 100) {
      messages.shift();
    }
    
    io.to(user.room).emit('receive_message', message);
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    if (users[socket.id]) {
      const username = users[socket.id].username;
      
      if (isTyping) {
        typingUsers[socket.id] = username;
      } else {
        delete typingUsers[socket.id];
      }
      
      io.emit('typing_users', Object.values(typingUsers));
    }
  });

  // Handle private messages
  socket.on('private_message', ({ to, message }) => {
    const messageData = {
      id: Date.now(),
      sender: users[socket.id]?.username || 'Anonymous',
      senderId: socket.id,
      message,
      timestamp: new Date().toISOString(),
      isPrivate: true,
    };
    
    socket.to(to).emit('private_message', messageData);
    socket.emit('private_message', messageData);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      const { username, room } = user;
      io.to(room).emit('user_left', { username, id: socket.id });
      console.log(`${username} left room ${room}`);
      delete users[socket.id];
      io.to(room).emit('user_list', Object.values(users).filter(u => u.room === room));
    }
    
    delete users[socket.id];
    delete typingUsers[socket.id];
    
    io.emit('user_list', Object.values(users));
    io.emit('typing_users', Object.values(typingUsers));
  });

  socket.on('message_read', (messageId) => {
    const user = users[socket.id];
    if (user) {
      io.to(user.room).emit('message_read_receipt', { messageId, userId: user.id, username: user.username });
    }
  });
});

// API routes
app.get('/api/messages', (req, res) => {
  res.json(messages);
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 