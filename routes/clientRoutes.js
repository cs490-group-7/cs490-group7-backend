const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

router.post('/initial-survey', clientController.addInitialSurvey);

module.exports = router;
