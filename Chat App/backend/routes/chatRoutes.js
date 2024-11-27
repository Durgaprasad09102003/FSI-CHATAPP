const express = require('express');
const Chat = require('../models/Chat')
const router = express.Router();
const mongoose = require('mongoose');

// Ensure this route matches exactly
router.get('/chatsData', async (req, res) => {
    try {
        const chats = await Chat.find()
            .populate('senderId', '_id username avatar phoneNumber')
            .populate('receiverId', '_id username avatar phoneNumber');
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching chats' });
    }
});


router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid User ID format.' });
  }

  try {
    const chats = await Chat.find({
      $or: [
        { senderId: userId },
        { receiverId: userId },
      ],
    })
      .populate('senderId', 'username avatar phoneNumber')
      .populate('receiverId', 'username avatar phoneNumber')
      .sort({ timestamp: 1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error.message);
    res.status(500).json({ message: 'Failed to load chat messages.', error: error.message });
  }
});

router.post('/messageData/:userId', async (req, res) => {
  const { userId } = req.params; 
  const {receiverId, message } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid User ID format.' });
  }

  try{
    const chatData = new Chat({
      senderId: userId,
      receiverId,
      message,
      timestamp: Date.now(),
    });
    await chatData.save();
    
    res.status(201).json({ success: true, message: 'Chat Data Successfully Stored!' });
  }
  catch(err){
    console.error('Error storing chat data:', err.message);
    res.status(500).json({ success: false, message: 'Failed to store chat data.' });
  }
});

router.delete('/clearchat', async (req, res) => {
  try {
    const { userId, receiverId } = req.body;
    
    // Clear chat messages between specific users
    const result = await Chat.deleteMany({
      $or: [
        { senderId: userId, receiverId: receiverId },
        { senderId: receiverId, receiverId: userId }
      ]
    });

    if (result.deletedCount > 0) {
      res.status(200).json({ success: true, message: 'Successfully cleared chat data' });
    } else {
      res.status(404).json({ success: false, message: 'No chat data found to clear' });
    }
  } catch (error) {
    console.error('Error clearing chat data:', error.message);
    res.status(500).json({ success: false, message: 'Failed to clear chat data.' });
  }
});

module.exports = router;
