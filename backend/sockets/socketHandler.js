const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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
        if (origin === frontendUrl || (origin.endsWith('.vercel.app') && (origin.includes('aptus') || isDev)) || configuredOrigins.includes(origin)) {
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
        if (!chatbotId || !mongoose.Types.ObjectId.isValid(chatbotId)) {
          console.warn(`[Socket.io] Rejected agent_join with invalid chatbotId: ${chatbotId}`);
          return;
        }

        // Authenticate agent via JWT token
        const token = authToken || socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, '');
        if (!token || typeof token !== 'string') {
          console.warn(`[Socket.io] Rejected agent_join without authToken for chatbotId: ${chatbotId}`);
          socket.emit('error', { message: 'Authentication required for agent access' });
          return;
        }

        const secret = process.env.JWT_SECRET || 'aptus_default_jwt_secret_fallback_key_2026';

        try {
          const decoded = jwt.verify(token.trim(), secret);
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
      try {
        if (!sessionId || !chatbotId) return;
        const normChatbotId = String(chatbotId);
        const normSessionId = String(sessionId);

        // Verify session belongs to chatbot if session exists in DB
        if (mongoose.Types.ObjectId.isValid(normSessionId) && mongoose.Types.ObjectId.isValid(normChatbotId)) {
          const session = await Session.findOne({ _id: normSessionId, chatbotId: normChatbotId }).catch(() => null);
          if (!session) {
            console.warn(`[Socket.io] Rejected join_session for non-matching sessionId: ${normSessionId} and chatbotId: ${normChatbotId}`);
            return;
          }
        }

        socket.sessionId = normSessionId;
        socket.chatbotId = normChatbotId;
        const room = `session_${normSessionId}`;
        socket.join(room);

        activeSessions.set(normSessionId, {
          userSocketId: socket.id,
          chatbotId: normChatbotId,
          agentSocketId: null,
        });

        console.log(`👤 User joined ${room}`);
      } catch (err) {
        console.error('[Socket.io] Error in join_session:', err);
      }
    });

    // User requests human handoff
    socket.on('request_human_agent', async ({ sessionId, chatbotId, userDetails }) => {
      try {
        if (!sessionId || !chatbotId) return;
        const normChatbotId = String(chatbotId);
        const normSessionId = String(sessionId);

        console.log(`🛎️ Hand-off requested for session ${normSessionId} on chatbot ${normChatbotId}`);
        const agents = activeAgents.get(normChatbotId);
        const isAgentOnline = agents && agents.size > 0;

        if (!isAgentOnline) {
          console.log(`⚠️ No live agents online for chatbot ${normChatbotId}. Triggering offline lead mode.`);
          if (mongoose.Types.ObjectId.isValid(normSessionId)) {
            await Session.findByIdAndUpdate(normSessionId, { status: 'waiting_human' }).catch(() => {});
          }
          socket.emit('human_agent_offline', {
            available: false,
            message: 'Right now our team is offline, but please leave your message and email, and a human will get back to you shortly.',
          });
          return;
        }

        // Agents are online - notify them
        if (mongoose.Types.ObjectId.isValid(normSessionId)) {
          await Session.findByIdAndUpdate(normSessionId, { status: 'waiting_human' }).catch(() => {});
        }
        io.to(`agent_${normChatbotId}`).emit('incoming_handoff_request', {
          sessionId: normSessionId,
          chatbotId: normChatbotId,
          userDetails,
          timestamp: new Date(),
        });

        socket.emit('human_agent_pending', {
          available: true,
          message: 'Connecting you with an agent. Please wait a moment...',
        });
      } catch (err) {
        console.error('[Socket.io] Error in request_human_agent:', err);
      }
    });

    // Agent accepts the handoff (agent only)
    socket.on('agent_accept_session', async ({ sessionId, agentName, agentId }) => {
      try {
        if (!socket.isAgent || !socket.chatbotId) {
          socket.emit('error', { message: 'Unauthorized: Only authenticated live agents can accept sessions' });
          return;
        }

        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
          return;
        }

        const session = await Session.findOne({ _id: sessionId, chatbotId: socket.chatbotId }).catch(() => null);
        if (!session) {
          console.warn(`[Socket.io] Agent ${socket.id} attempted to accept non-existent or foreign session: ${sessionId}`);
          return;
        }

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
      } catch (err) {
        console.error('[Socket.io] Error in agent_accept_session:', err);
      }
    });

    // Agent sends a message in human mode (agent only)
    socket.on('agent_send_message', async ({ sessionId, message, chatbotId, agentName }) => {
      try {
        if (!socket.isAgent || !socket.chatbotId) {
          socket.emit('error', { message: 'Unauthorized: Only agents can send agent messages' });
          return;
        }

        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId) || !message || typeof message !== 'string') {
          return;
        }

        const cleanChatbotId = socket.chatbotId;

        // Enforce ownership: agents may only message sessions for their own chatbot
        const ownedSession = await Session.findOne({ _id: sessionId, chatbotId: cleanChatbotId }).catch(() => null);
        if (!ownedSession) {
          console.warn(`[Socket.io] Agent ${socket.id} attempted to message foreign/missing session: ${sessionId}`);
          socket.emit('error', { message: 'Unauthorized: Session not found for this chatbot' });
          return;
        }

        const msgDoc = await Message.create({
          sessionId,
          message: message.trim(),
          role: 'chatbot',
          sender: 'human_agent',
          chatbotId: cleanChatbotId,
        });

        await Session.findByIdAndUpdate(sessionId, {
          $push: { messages: msgDoc._id },
        });

        // Broadcast to everyone in the session
        io.to(`session_${sessionId}`).emit('new_message', {
          _id: msgDoc._id,
          message: message.trim(),
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
        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId) || !message || typeof message !== 'string') {
          return;
        }

        if (socket.sessionId && String(socket.sessionId) !== String(sessionId)) {
          return;
        }

        const msgDoc = await Message.create({
          sessionId,
          message: message.trim(),
          role: 'user',
          sender: 'user',
          chatbotId: chatbotId || socket.chatbotId,
        });

        await Session.findByIdAndUpdate(sessionId, {
          $push: { messages: msgDoc._id },
        });

        io.to(`session_${sessionId}`).emit('new_message', {
          _id: msgDoc._id,
          message: message.trim(),
          sender: 'user',
          role: 'user',
          createdAt: msgDoc.createdAt,
        });
      } catch (err) {
        console.error('❌ Error saving human session user message:', err);
      }
    });

    // Agent closes human session and hands back to AI (agent only)
    socket.on('agent_close_session', async ({ sessionId, message }) => {
      try {
        if (!socket.isAgent || !socket.chatbotId) {
          return;
        }

        if (!sessionId || !mongoose.Types.ObjectId.isValid(sessionId)) {
          return;
        }

        await Session.findOneAndUpdate(
          { _id: sessionId, chatbotId: socket.chatbotId },
          { status: 'active', agentSocketId: null }
        ).catch(() => {});

        io.to(`session_${sessionId}`).emit('agent_left_chat', {
          message: message || 'The live agent has left the chat. The AI assistant is back to assist you.',
        });
      } catch (err) {
        console.error('[Socket.io] Error in agent_close_session:', err);
      }
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

        // Clean up visitor session map entries to prevent memory leaks
        if (socket.sessionId) {
          const sessionData = activeSessions.get(socket.sessionId);
          if (sessionData && sessionData.userSocketId === socket.id) {
            activeSessions.delete(socket.sessionId);
          } else if (sessionData && sessionData.agentSocketId === socket.id) {
            sessionData.agentSocketId = null;
          }
        } else if (socket.isAgent) {
          for (const sessionData of activeSessions.values()) {
            if (sessionData.agentSocketId === socket.id) {
              sessionData.agentSocketId = null;
            }
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
  if (!chatbotId) return 0;
  const agents = activeAgents.get(chatbotId.toString());
  return agents ? agents.size : 0;
}

module.exports = { initSocket, getActiveAgentsCount };
