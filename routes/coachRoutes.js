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

router.post('/get-current-coach', async (req, res) => {
  try {
    const clientId = req.body.userId;
    const result = await CoachController.getCurrentCoach(clientId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/remove-coach', async (req, res) => {
  try {
    const clientId = req.body.userId;
    const result = await CoachController.removeCoach(clientId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/removal-reason', async (req, res) => {
  try {
    const clientId = req.body.userId;
    const coachId = req.body.coachId;
    const reason = req.body.reason;
    const result = await CoachController.addRemovalReason(clientId, coachId, reason);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/client-progress', async (req, res) => {
  try {
    const clientId = req.body.clientId;
    const result = await CoachController.getClientProgress(clientId);
    res.status(200).json(result);
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