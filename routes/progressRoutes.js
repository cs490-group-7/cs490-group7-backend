const express = require('express');
const db_conn = require('../db_connection');

const router = express.Router();

router.get('/progress-data', async (req, res) => {
  try {
      const exerciseQuery = 'SELECT date, weight, calorie_intake, water_intake FROM DailySurvey WHERE user_id = 1';

      const results = await new Promise((resolve, reject) => {
          db_conn.query(exerciseQuery, (error, results, fields) => {
              if (error) reject(error);
              else resolve(results);
          });
      });
      res.json(results);
  } catch (error) {
      console.error('Data retrieval error:', error);
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;