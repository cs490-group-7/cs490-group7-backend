const express = require('express');
const bcrypt = require('bcrypt');
const db_conn = require('../db_connection');
const UserController = require('../controllers/userController');

const router = express.Router();

// Registration Endpoint
// Registration Endpoint
router.post('/register', async (req, res) => {
  try {
    const result = await UserController.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await UserController.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Initial Coach Search Endpoint
router.post('/coach-details', async (req, res) => {
  const { fname, lname, userId } = req.body;

  try {
    const result = await UserController.coachDetails(fname, lname, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/pending-coaches', async (req, res) => {
  try {
    const result = await UserController.getPendingCoaches();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update coach approval status
router.post('/update-coach-approval', async (req, res) => {
  const { coachId, isApproved } = req.body;

  try {
    const result = await UserController.updateCoachApprovalStatus(coachId, isApproved);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/exercise-bank', async (req, res) => {
  try {
    const result = await UserController.getExerciseBank();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/add-exercise', async (req, res) => {
  const { exercise_name, exercise_type } = req.body;

  try {
    const result = await UserController.addExercise(exercise_name, exercise_type);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/delete-exercise', async (req, res) => {
  const { exercise_id } = req.body;

  try {
    const result = await UserController.deleteExercise(exercise_id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/request-coach', async (req, res) => {
  const { coachId, clientId } = req.body;

  try {
    const result = await UserController.requestCoach(coachId, clientId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/get-coach-requests', async (req, res) => {
  const { coachId } = req.body;

  try {
    const result = await UserController.getCoachRequests(coachId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/handle-request', async (req, res) => {
  const { coachId, clientId, isAccepted } = req.body;

  try {
    const result = await UserController.handleRequest(coachId, clientId, isAccepted);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating coach request' });
  }
});


module.exports = router;