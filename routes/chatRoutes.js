const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.post('/send-message', async (req, res) => {
  try {
    const result = await chatController.sendMessage(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'An error occurred while sending the message.' });
  }
});

router.post('/get-messages', async (req, res) => {
  try {
    const result = await chatController.getMessages(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'An error occurred while getting the messages.' });
  }
});

module.exports = router;