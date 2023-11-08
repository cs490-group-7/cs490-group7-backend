const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/initial-survey', clientController.addInitialSurvey);
router.get('../mock-data', (req, res) => {
    try {
      const mockData = JSON.parse(fs.readFileSync(mockDataFilePath, 'utf8'));
      res.json(mockData);
    } catch (error) {
      console.error('Error reading mock data:', error);
      res.status(500).json({ error: 'Failed to retrieve mock data' });
    }
  });
module.exports = router;
