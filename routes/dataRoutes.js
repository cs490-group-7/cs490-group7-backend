const express = require('express');
const db_conn = require('../db_connection');
const router = express.Router();
const mockDataFile = require('./mock-data.json');

const mockData = {
    "dailyFilled": false,
    "calories": null,
    "waterIntake": null,
    "weight": null,
    "caloriesError": null,
    "waterIntakeError": null,
    "weightError": null,
    "goalMessage": "Lose 30 pounds",
    "goalBaseline": 130,
    "goalTarget": 100,
    "goalCurrent": 115,
    "progress": 0.5,
    "workoutName": "Chest and Triceps Day",
    "workoutCompletion": false
}

router.get('/dashboard-mock-data', (req, res) => {
    try {
      res.json(mockData);
    } catch (error) {
      console.error('Error sending mock data:', error);
      res.status(500).json({ error: 'Failed to retrieve mock data' });
    }
});

router.post('/dashboard-data', async (req, res) => {
  const userId = req.body.userId;
  try {
      const query = 'SELECT weight AS goalBaseline, weightGoal, weightGoalValue, ('+
                    'CASE WHEN EXISTS(SELECT weight FROM fitness_app.dailysurvey WHERE user_id=?) '+
                    'THEN (SELECT weight FROM fitness_app.dailysurvey WHERE user_id=? ORDER BY date DESC LIMIT 1) '+
                    'ELSE (SELECT weight FROM fitness_app.clientinitialsurvey WHERE user_id=?) END) AS currentWeight, ('+
                    'SELECT workout_name FROM fitness_app.workoutcalendar, fitness_app.workout WHERE user_id=? AND fitness_app.workoutcalendar.workout_id = fitness_app.workout.workout_id '+
                    'AND WEEKDAY(CURDATE()) = 6) AS workout_name '+ //Change 6 -> day_of_week
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