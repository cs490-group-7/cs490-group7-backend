const express = require('express');
const db_conn = require('../db_connection');
const router = express.Router();

router.post('/dashboard-data', async (req, res) => {
  const userId = req.body.userId;
  try {
      const query = 'SELECT weight AS goalBaseline, weightGoal, weightGoalValue, ('+
                    'CASE WHEN EXISTS(SELECT weight FROM DailySurvey WHERE user_id=?) '+
                    'THEN (SELECT weight FROM DailySurvey WHERE user_id=? ORDER BY date DESC LIMIT 1) '+
                    'ELSE (SELECT weight FROM ClientInitialSurvey WHERE user_id=?) END) AS currentWeight, ('+
                    'SELECT workout_name FROM WorkoutCalendar, Workout WHERE user_id=? AND WorkoutCalendar.workout_id = Workout.workout_id '+
                    'AND WEEKDAY(CURDATE()+1) = day_of_week) AS workout_name '+ //Change 6 -> day_of_week
                    'FROM ClientInitialSurvey';
      const results = await new Promise((resolve, reject) => {
          db_conn.query(query, [userId,userId,userId,userId], (error, results, fields) => {
              if (error) reject(error);
              else resolve(results);
          });
      });
      res.json(results[0]);
  } catch (error) {
      console.error('Data retrieval error:', error);
      res.status(500).json({ message: "Error retrieving dashboard data" });
  }
});

module.exports = router;