const express = require('express');
const ProgressController = require('../controllers/progressController');
const router = express.Router();

router.post('/progress-data', async (req, res) => {
  const userId = req.body.userId;
  try {
    const progressData = await ProgressController.getProgressData(userId);
    res.json(progressData);
  } catch (error) {
    console.error('Data retrieval error:', error);
    res.status(500).json({ message: 'Error retrieving progress data' });
  }
});

router.post('/goal-info', async (req, res) => {
  const userId = req.body.userId;
  try {
    const goalInfo = await ProgressController.getGoalInfo(userId);
    res.json(goalInfo);
  } catch (error) {
    console.error('Data retrieval error:', error);
    res.status(500).json({ message: 'Error retrieving goal info' });
  }
});

router.post('/current-weight', async (req, res) => {
  const userId = req.body.userId;
  try {
    const currentWeight = await ProgressController.getCurrentWeight(userId);
    res.json(currentWeight);
  } catch (error) {
    console.error('Data retrieval error:', error);
    res.status(500).json({ message: 'Error retrieving current weight' });
  }
});

router.post('/update-goal-info', async (req, res) => {
  const inputData = req.body;
  try {
    const result = await ProgressController.updateGoalInfo(inputData);
    res.json(result);
  } catch (error) {
    console.error('Error updating goal info:', error);
    res.status(500).json({ message: 'Error updating goal info' });
  }
});

module.exports = router;
