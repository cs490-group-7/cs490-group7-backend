const express = require('express');
const CoachController = require('../controllers/coachController');
const router = express.Router();

router.post('/check-approval-status', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await CoachController.checkApprovalStatus(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/get-current-clients', async (req, res) => {
  try {
    const coachId = req.body.userId;
    const results = await CoachController.getCurrentClients(coachId);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/coach-lookup', async (req, res) => {
  try {
    const filters = req.body;
    const results = await CoachController.coachLookup(filters);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;