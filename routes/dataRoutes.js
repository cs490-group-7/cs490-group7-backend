const express = require('express');
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

router.get('/home-mock-data', (req, res) => {
    try {
      res.json(mockData);
    } catch (error) {
      console.error('Error sending mock data:', error);
      res.status(500).json({ error: 'Failed to retrieve mock data' });
    }
});

module.exports = router;