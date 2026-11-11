const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Session = require('../models/sessionModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

// Map of active agents by chatbotId: chatbotId -> Set of socketIds
const activeAgents = new Map();
// Map of active sessions: sessionId -> { userSocketId, agentSocketId, chatbotId }
const activeSessions = new Map();

function initSocket(server) {
  const isDev = process.env.NODE_ENV !== 'production';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const configuredOrigins = process.env.SOCKET_CORS_ORIGINS 
    ? process.env.SOCKET_CORS_ORIGINS.split(',').map((s) => s.trim()) 
    : [];

  const io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (isDev && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
          return callback(null, true);
        }
        if (origin === frontendUrl || origin.endsWith('.vercel.app') || configuredOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 [Socket.io] Client connected: ${socket.id}`);

    // --- AGENT EVENTS ---
    socket.on('agent_join', async ({ chatbotId, agentId, authToken }) => {
      try {
        if (!chatbotId) return;

        // Authenticate agent via JWT token
        const token = authToken || socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');
        if (!token) {
          console.warn(`[Socket.io] Rejected agent_join without authToken for chatbotId: ${chatbotId}`);
          socket.emit('error', { message: 'Authentication required for agent access' });
          return;
        }

        if (!process.env.JWT_SECRET) {
          console.error('[Socket.io] JWT_SECRET is not configured on server');
          socket.emit('error', { message: 'Server configuration error: JWT_SECRET missing' });
          return;
        }

        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (String(decoded.id) !== String(chatbotId)) {
            console.warn(`[Socket.io] Rejected agent_join: token user ${decoded.id} does not match chatbot ${chatbotId}`);
            socket.emit('error', { message: 'Unauthorized: Token does not own this chatbot' });
            return;
          }
        } catch (jwtErr) {
          console.warn(`[Socket.io] Invalid JWT on agent_join: ${jwtErr.message}`);
          socket.emit('error', { message: 'Invalid or expired authentication token' });
          return;
        }

        const user = await User.findById(chatbotId).catch(() => null);
        if (!user) {
          console.warn(`[Socket.io] Rejected unauthorized agent_join for invalid chatbotId: ${chatbotId}`);
          return;
        }

        const normChatbotId = String(chatbotId);
        socket.chatbotId = normChatbotId;
        socket.agentId = agentId;
        socket.isAgent = true;

        const room = `agent_${normChatbotId}`;
        socket.join(room);

        if (!activeAgents.has(normChatbotId)) {
          activeAgents.set(normChatbotId, new Set());
        }
        activeAgents.get(normChatbotId).add(socket.id);

        // Mark agent available in User document
        await User.findByIdAndUpdate(normChatbotId, { liveAgentAvailable: true, isLiveAgent: true }).catch(() => {});

        // Re-ensure agent is in map in case of concurrent disconnect of previous socket
        if (!activeAgents.has(normChatbotId)) {
          activeAgents.set(normChatbotId, new Set());
        }
        activeAgents.get(normChatbotId).add(socket.id);

        const onlineCount = activeAgents.get(normChatbotId)?.size || 1;
        console.log(`👨‍💼 Agent ${agentId || socket.id} joined ${room}. Online count: ${onlineCount}`);
        io.to(room).emit('agent_status_update', { onlineAgents: onlineCount });
      } catch (err) {
        console.error('[Socket.io] Error in agent_join:', err);
      }
    });

    // --- VISITOR / SESSION EVENTS ---
    socket.on('join_session', async ({ sessionId, chatbotId }) => {
      if (!sessionId || !chatbotId) return;
      const session = await Session.findOne({ _id: sessionId, chatbotId }).catch(() => null);
      if (!session) {
        console.warn(`[Socket.io] Rejected join_session for non-matching sessionId: ${sessionId} and chatbotId: ${chatbotId}`);
        return;
      }

      socket.sessionId = sessionId;
      socket.chatbotId = chatbotId;
      const room = `session_${sessionId}`;
      socket.join(room);

      activeSessions.set(sessionId, {
        userSocketId: socket.id,
        chatbotId,
        agentSocketId: null,
      });

      console.log(`👤 User joined ${room}`);
    });

    // User requests human handoff
    socket.on('request_human_agent', async ({ sessionId, chatbotId, userDetails }) => {
      console.log(`🛎️ Hand-off requested for session ${sessionId} on chatbot ${chatbotId}`);
      const agents = activeAgents.get(chatbotId);
      const isAgentOnline = agents && agents.size > 0;

      if (!isAgentOnline) {
        console.log(`⚠️ No live agents online for chatbot ${chatbotId}. Triggering offline lead mode.`);
        await Session.findByIdAndUpdate(sessionId, { status: 'waiting_human' }).catch(() => {});
        socket.emit('human_agent_offline', {
          available: false,
          message: 'Right now our team is offline, but please leave your message and email, and a human will get back to you shortly.',
        });
        return;
      }

      // Agents are online - notify them
      await Session.findByIdAndUpdate(sessionId, { status: 'waiting_human' }).catch(() => {});
      io.to(`agent_${chatbotId}`).emit('incoming_handoff_request', {
        sessionId,
        chatbotId,
        userDetails,
        timestamp: new Date(),
      });

      socket.emit('human_agent_pending', {
        available: true,
        message: 'Connecting you with an agent. Please wait a moment...',
      });
    });

    // Agent accepts the handoff
    socket.on('agent_accept_session', async ({ sessionId, agentName, agentId }) => {
      const sessionData = activeSessions.get(sessionId);
      if (sessionData) {
        sessionData.agentSocketId = socket.id;
      }

      await Session.findByIdAndUpdate(sessionId, {
        status: 'human_active',
        agentSocketId: socket.id,
        assignedAgentId: agentId || null,
      }).catch(() => {});

      socket.join(`session_${sessionId}`);

      // Notify the visitor in the session
      io.to(`session_${sessionId}`).emit('agent_joined_chat', {
        agentName: agentName || 'Support Representative',
        sessionId,
        message: `${agentName || 'A support representative'} has joined the chat. How can we help?`,
      });

      console.log(`🤝 Agent ${socket.id} accepted session ${sessionId}`);
    });

    // Agent sends a message in human mode
    socket.on('agent_send_message', async ({ sessionId, message, chatbotId, agentName }) => {
      try {
        const msgDoc = await Message.create({
          sessionId,
          message,
          role: 'chatbot',
          sender: 'human_agent',
          chatbotId,
        });

        await Session.findByIdAndUpdate(sessionId, {
          $push: { messages: msgDoc._id },
        });

        // Broadcast to everyone in the session
        io.to(`session_${sessionId}`).emit('new_message', {
          _id: msgDoc._id,
          message,
          sender: 'human_agent',
          role: 'chatbot',
          agentName: agentName || 'Support Agent',
          createdAt: msgDoc.createdAt,
        });
      } catch (err) {
        console.error('❌ Error saving agent message:', err);
      }
    });

    // User sends message while in human active mode
    socket.on('user_send_human_message', async ({ sessionId, message, chatbotId }) => {
      try {
        const msgDoc = await Message.create({
          sessionId,
          message,
          role: 'user',
          sender: 'user',
          chatbotId,
        });

        await Session.findByIdAndUpdate(sessionId, {
          $push: { messages: msgDoc._id },
        });

        io.to(`session_${sessionId}`).emit('new_message', {
          _id: msgDoc._id,
          message,
          sender: 'user',
          role: 'user',
          createdAt: msgDoc.createdAt,
        });
      } catch (err) {
        console.error('❌ Error saving human session user message:', err);
      }
    });

    // Agent closes human session and hands back to AI
    socket.on('agent_close_session', async ({ sessionId, message }) => {
      await Session.findByIdAndUpdate(sessionId, {
        status: 'active',
        agentSocketId: null,
      }).catch(() => {});

      io.to(`session_${sessionId}`).emit('agent_left_chat', {
        message: message || 'The live agent has left the chat. The AI assistant is back to assist you.',
      });
    });

    // Disconnect handling
    socket.on('disconnect', async () => {
      try {
        if (socket.isAgent && socket.chatbotId) {
          const agents = activeAgents.get(socket.chatbotId);
          if (agents) {
            agents.delete(socket.id);
            if (agents.size === 0) {
              activeAgents.delete(socket.chatbotId);
              await User.findByIdAndUpdate(socket.chatbotId, { liveAgentAvailable: false }).catch(() => {});
            }
            io.to(`agent_${socket.chatbotId}`).emit('agent_status_update', { onlineAgents: agents.size });
          }
        }
        console.log(`🔌 Client disconnected: ${socket.id}`);
      } catch (err) {
        console.error('[Socket.io] Error in disconnect:', err);
      }
    });
  });

  return io;
}

function getActiveAgentsCount(chatbotId) {
  const agents = activeAgents.get(chatbotId.toString());
  return agents ? agents.size : 0;
}

module.exports = { initSocket, getActiveAgentsCount };
