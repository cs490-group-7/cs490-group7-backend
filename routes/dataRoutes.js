const express = require('express');
const DataController = require('../controllers/dataController');
const router = express.Router();

router.get('/dashboard-mock-data', async (req, res) => {
  try {
    const mockData = await DataController.getDashboardMockData();
    res.json(mockData);
  } catch (error) {
    console.error('Error sending mock data:', error);
    res.status(500).json({ error: 'Failed to retrieve mock data' });
  }
});

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
