const express = require('express');
const DataController = require('../controllers/dataController');
const router = express.Router();

router.post('/dashboard-data', async (req, res) => {
  const userId = req.body.userId;
  try {
    const dashboardData = await DataController.getDashboardData(userId);
    res.json(dashboardData);
  } catch (error) {
    console.error('Data retrieval error:', error);
    res.status(500).json({ message: 'Error retrieving dashboard data' });
  }
});

module.exports = router;
