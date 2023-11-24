const express = require('express');
const db_conn = require('../db_connection');

const router = express.Router();

router.post('/progress-data', async (req, res) => {
    const userId = req.body.userId;
    try {
        const query = 'SELECT date, weight, calorie_intake, water_intake FROM DailySurvey WHERE user_id = ?';
        const results = await new Promise((resolve, reject) => {
            db_conn.query(query, [userId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Data retrieval error:', error);
        res.status(500).json({ message: "Error retrieving progress data" });
    }
});

module.exports = router;