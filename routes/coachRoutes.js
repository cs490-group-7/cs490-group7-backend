const express = require('express');
const router = express.Router();
const coachController = require('../controllers/coachController');

router.post('/initial-survey', coachController.addInitialSurvey);

module.exports = router;
