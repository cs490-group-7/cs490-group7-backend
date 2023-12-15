const express = require('express');
const router = express.Router();

router.post('/send-message', (req, res) => {
    try {
        const { message } = req.body;

        // Emit the message event to all connected clients
        req.io.emit('message', message);

        res.status(200).send({ message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).send({ error: 'An error occurred while sending the message.' });
    }
});

module.exports = router;