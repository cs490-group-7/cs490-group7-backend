const express = require('express');
const SurveyController = require('../controllers/surveyController');
const router = express.Router();

router.post('/initial-survey', async (req, res) => {
  try {
    const surveyData = req.body;
    await SurveyController.addInitialSurvey(surveyData);
    res.status(200).json({ message: 'Initial survey added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/coach-survey', async (req, res) => {
  try {
    const surveyData = req.body;
    await SurveyController.addCoachSurvey(surveyData);
    res.status(200).json({ message: 'Coach survey added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/daily-survey', async (req, res) => {
  try {
    const surveyData = req.body;
    await SurveyController.addDailySurvey(surveyData);
    res.status(200).json({ message: 'Daily survey added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
