const express = require('express');
const router = express.Router();
const coachController = require('../controllers/coachController');

router.post('/coach-survey', coachController.addCoachSurvey);

module.exports = router;
