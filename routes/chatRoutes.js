const express = require('express');
const db_conn = require('../db_connection');
const router = express.Router();

router.post('/send-message', (req, res) => {
    const { user_id, user_type, coach_id, client_id, message } = req.body;

    // Determine the coach_id and client_id based on the user_type
    const from_coach = user_type === 'Coach';
    const actual_coach_id = from_coach ? user_id : coach_id;
    const actual_client_id = from_coach ? client_id : user_id;

    // Check if the chat_id exists
    const checkQuery = 'SELECT * FROM Chat WHERE coach_id = ? AND client_id = ?';
    db_conn.query(checkQuery, [actual_coach_id, actual_client_id], (error, results) => {
        if (error) {
            console.error('Error checking chat_id:', error);
            return res.status(500).json({ error: 'An error occurred while checking the chat_id.' });
        } else if (results.length === 0) {
            // If the chat_id doesn't exist, create a new chat
            const createQuery = 'INSERT INTO Chat (coach_id, client_id) VALUES (?, ?)';
            db_conn.query(createQuery, [actual_coach_id, actual_client_id], (error, results) => {
                if (error) {
                    console.error('Error creating chat:', error);
                    return res.status(500).json({ error: 'An error occurred while creating the chat.' });
                }
            });
        }

        // Save the message to the database
        const query = 'INSERT INTO Message (chat_id, from_coach, message) VALUES ((SELECT chat_id FROM Chat WHERE coach_id = ? AND client_id = ?), ?, ?)';
        db_conn.query(query, [actual_coach_id, actual_client_id, from_coach, message], (error, results) => {
            if (error) {
                console.error('Error saving message:', error);
                return res.status(500).json({ error: 'An error occurred while saving the message.' });
            } else {
                return res.status(200).json({ message: 'Message saved successfully.' });
            }
        });
    });
});

module.exports = router;