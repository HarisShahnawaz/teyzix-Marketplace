import express from 'express';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Send a message
router.post('/send', protect, async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver ID and text are required' });
    }

    // Check if conversation already exists between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId], $size: 2 }
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessage: text
      });
    }

    // Create new message
    const message = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      text,
      isRead: false
    });

    // Update conversation's last message and timestamp
    conversation.lastMessage = text;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Populate message details for response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name avatar role')
      .populate('conversationId');

    // Emit real-time message to recipient if online
    const io = req.app.get('io');
    const onlineUsers = req.app.get('onlineUsers');
    
    if (io && onlineUsers) {
      const recipientSocketId = onlineUsers.get(receiverId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('getMessage', populatedMessage);
        console.log('Message sent to online user:', receiverId);
      }
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all conversations for logged-in user
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId
    })
      .populate('participants', 'name avatar role')
      .sort({ updatedAt: -1 });

    // Filter out the logged-in user from participants array
    const filteredConversations = conversations.map(conv => {
      const otherParticipants = conv.participants.filter(
        p => p._id.toString() !== userId
      );
      return {
        ...conv.toObject(),
        participants: otherParticipants
      };
    });

    res.status(200).json(filteredConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get message history for a specific conversation
router.get('/history/:conversationId', protect, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Not authorized to access this conversation' });
    }

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name avatar role')
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching message history:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get unread message count
router.get('/unread-count', protect, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId
    });

    // Count unread messages (messages not sent by user and not read)
    let unreadCount = 0;
    for (const conversation of conversations) {
      const unreadMessages = await Message.countDocuments({
        conversationId: conversation._id,
        sender: { $ne: userId },
        isRead: false
      });
      unreadCount += unreadMessages;
    }

    res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark messages as read in a conversation
router.put('/mark-read/:conversationId', protect, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of this conversation
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({ message: 'Not authorized to access this conversation' });
    }

    // Mark all messages not sent by current user as read
    await Message.updateMany(
      {
        conversationId,
        sender: { $ne: userId },
        isRead: false
      },
      { isRead: true }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
