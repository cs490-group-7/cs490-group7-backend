const express = require('express');
const WorkoutController = require('../controllers/workoutController');

const router = express.Router();

// Exercise Bank
router.get('/exercise-bank', async (req, res) => {
  try {
    const exerciseBank = await WorkoutController.getExerciseBank();
    res.json(exerciseBank);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Workout List
router.post('/workout-list', async (req, res) => {
  const { userId } = req.body;
  try {
    const workoutList = await WorkoutController.getWorkoutList(userId);
    res.json(workoutList);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete Workout
router.post('/delete-workout', async (req, res) => {
  const { workoutId } = req.body;
  try {
    await WorkoutController.deleteWorkout(workoutId);
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Workout Details
router.post('/workout-details', async (req, res) => {
  const { workoutId } = req.body;
  try {
    const workoutDetails = await WorkoutController.getWorkoutDetails(workoutId);
    res.json(workoutDetails);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create Workout
router.post('/create-workout', async (req, res) => {
  const { creatorId, workoutName, setCount, description, exercises } = req.body;
  try {
    await WorkoutController.createWorkout(creatorId, workoutName, setCount, description, exercises);
    res.status(201).json({ message: 'Workout created successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit Workout
router.post('/edit-workout', async (req, res) => {
  const { workoutId, creatorId, workoutName, setCount, description, exercises } = req.body;
  try {
    await WorkoutController.editWorkout(workoutId, creatorId, workoutName, setCount, description, exercises);
    res.json({ message: 'Workout edited successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign Workout
router.post('/assign-workout', async (req, res) => {
  const { userId, workoutId, dayOfWeek } = req.body;
  try {
    await WorkoutController.assignWorkout(userId, workoutId, dayOfWeek);
    res.status(201).json({ message: 'Assignment created successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }


});

// Get Assignments
router.post('/get-assignments', async (req, res) => {
    const { userId } = req.body;
    try {
      const assignments = await WorkoutController.getAssignments(userId);
      res.json(assignments);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get Today's Logs
  router.post('/get-todays-logs', async (req, res) => {
    const { userId } = req.body;
    try {
      const todayLogs = await WorkoutController.getTodaysLogs(userId);
      res.json(todayLogs);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Unassign Workout
  router.post('/unassign-workout', async (req, res) => {
    const { workoutId, userId, dayOfWeek } = req.body;
    try {
      await WorkoutController.unassignWorkout(workoutId, userId, dayOfWeek);
      res.json({ message: 'Workout unassigned successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Log Session
  router.post('/log-session', async (req, res) => {
    const { userId, workoutId, sessionDate, dayOfWeek } = req.body;
    try {
      await WorkoutController.logSession(userId, workoutId, sessionDate, dayOfWeek);
      res.status(201).json({ message: 'Session logged successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;