// server.js
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Store connected users in memory
let connectedUsers = [];

// Helper function to clean up disconnected users
const cleanupDisconnectedUsers = () => {
  connectedUsers = connectedUsers.filter(user => user.socket.connected);
};

app.prepare().then(() => {
  const server = createServer((req, res) => {
    // Set CORS headers for all requests
    res.setHeader('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_FRONTEND_URL || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    handle(req, res);
  });

  // Configure Socket.IO with enhanced settings
  const io = new Server(server, {
    cors: {
      origin: process.env.NEXT_PUBLIC_FRONTEND_URL || "*",
      methods: ["GET", "POST", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"]
    },
    path: "/api/socketio",
    transports: ['polling', 'websocket'], // Start with polling, then upgrade to websocket
    pingTimeout: 30000,
    pingInterval: 10000,
    upgradeTimeout: 10000,
    allowUpgrades: true,
    perMessageDeflate: true,
    httpCompression: true,
    connectTimeout: 45000,
    maxHttpBufferSize: 1e8
  });

  // Error handling middleware
  io.use((socket, next) => {
    const handshakeData = socket.handshake;
    if (handshakeData.headers && handshakeData.headers.authorization) {
      next();
    } else {
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle transport change
    socket.on('upgrade', (transport) => {
      console.log('Transport upgraded to:', transport);
    });

    socket.on('register', ({ userId, role }) => {
      // Remove any existing connections for this user
      connectedUsers = connectedUsers.filter(user => user.userID !== userId);
      
      // Add new connection
      connectedUsers.push({
        socketId: socket.id,
        userID: userId,
        role: role,
        socket,
        connectedAt: new Date()
      });
      console.log(`User registered - ID: ${userId}, Role: ${role}`);
    });

    socket.on('userRegister', ({ userId, message }) => {
      try {
        const recipient_admin = connectedUsers.find(
          (user) => user.role === 'admin'
        );
        if (recipient_admin) {
          recipient_admin.socket.emit('receiveMessage', message);
          socket.emit('messageSent', { success: true });
        } else {
          socket.emit('messageSent', { 
            success: false, 
            error: 'No admin available' 
          });
        }
      } catch (error) {
        console.error('Error in userRegister:', error);
        socket.emit('messageSent', { 
          success: false, 
          error: 'Internal server error' 
        });
      }
    });

    socket.on('userVerify', ({ userId, message }) => {
      try {
        const recipient_admin = connectedUsers.find(
          (user) => user.role === 'admin'
        );
        if (recipient_admin) {
          recipient_admin.socket.emit('receiveMessage', message);
          socket.emit('messageSent', { success: true });
        } else {
          socket.emit('messageSent', { 
            success: false, 
            error: 'No admin available' 
          });
        }
      } catch (error) {
        console.error('Error in userVerify:', error);
        socket.emit('messageSent', { 
          success: false, 
          error: 'Internal server error' 
        });
      }
    });

    socket.on('adminRegister', (data) => {
      try {
        const recipient = connectedUsers.find(
          (user) => user.userID === data.receiveuserId
        );
        if (recipient) {
          recipient.socket.emit('receiveMessage', data.message);
          socket.emit('messageSent', { success: true });
        } else {
          socket.emit('messageSent', { 
            success: false, 
            error: 'User not found' 
          });
        }
      } catch (error) {
        console.error('Error in adminRegister:', error);
        socket.emit('messageSent', { 
          success: false, 
          error: 'Internal server error' 
        });
      }
    });

    socket.on('adminLoginId', (data) => {
      try {
        const recipient = connectedUsers.find(
          (user) => user.userID === data.receiveuserId
        );
        if (recipient) {
          recipient.socket.emit('receiveMessage', data.message);
          socket.emit('messageSent', { success: true });
        } else {
          socket.emit('messageSent', { 
            success: false, 
            error: 'User not found' 
          });
        }
      } catch (error) {
        console.error('Error in adminLoginId:', error);
        socket.emit('messageSent', { 
          success: false, 
          error: 'Internal server error' 
        });
      }
    });

    socket.on('adminPasswordCode', (data) => {
      try {
        const recipient = connectedUsers.find(
          (user) => user.userID === data.receiveuserId
        );
        if (recipient) {
          recipient.socket.emit('receiveMessage', data.message);
          socket.emit('messageSent', { success: true });
        } else {
          socket.emit('messageSent', { 
            success: false, 
            error: 'User not found' 
          });
        }
      } catch (error) {
        console.error('Error in adminPasswordCode:', error);
        socket.emit('messageSent', { 
          success: false, 
          error: 'Internal server error' 
        });
      }
    });

    // Handle all request events with acknowledgments
    const requestEvents = [
      'registerRequest',
      'verifyRequest',
      'depositRequest',
      'withdrawalRequest',
      'selectAllIds',
      'selectIds',
      'selectHistoryAllIds',
      'selectHistoryIds',
      'selectWithdrawalAllIds',
      'selectWithdrawalIds',
      'selectWithdrawalHistoryAllIds',
      'selectWithdrawalHistoryIds',
      'selectCodeVerifyAllIds',
      'selectCodeVerifyIds',
      'selectRegisterAllIds',
      'selectRegisterIds'
    ];

    requestEvents.forEach(eventName => {
      socket.on(eventName, (data) => {
        try {
          const responseEvent = eventName.replace('Request', 'Recieve')
            .replace('select', 'select')
            .replace('Ids', 'MultiIds')
            .replace('Id', 'MultiId');
          
          socket.emit(responseEvent, data);
          socket.emit(`${eventName}Ack`, { success: true });
        } catch (error) {
          console.error(`Error in ${eventName}:`, error);
          socket.emit(`${eventName}Ack`, { 
            success: false, 
            error: 'Internal server error' 
          });
        }
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('Client disconnected:', socket.id, 'Reason:', reason);
      connectedUsers = connectedUsers.filter(
        (item) => item.socketId !== socket.id
      );
      cleanupDisconnectedUsers();
    });

    // Enhanced error handling
    socket.on('error', (error) => {
      console.error('Socket error:', error);
      // Attempt to reconnect on error
      if (!socket.connected) {
        socket.connect();
      }
    });

    // Handle transport errors
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      // Try alternative transport
      if (socket.io.opts.transports.includes('websocket')) {
        socket.io.opts.transports = ['polling'];
      } else {
        socket.io.opts.transports = ['websocket'];
      }
    });
  });

  // Run periodic cleanup more frequently in production
  const cleanupInterval = process.env.NODE_ENV === 'production' ? 15000 : 30000;
  setInterval(cleanupDisconnectedUsers, cleanupInterval);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});