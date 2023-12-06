const express = require('express');
const db_conn = require('../db_connection');

const router = express.Router();

router.get('/exercise-bank', async (req, res) => {
  try {
      const exerciseQuery = 'SELECT exercise_id, exercise_name FROM ExerciseBank ORDER BY exercise_name ASC';

      const results = await new Promise((resolve, reject) => {
          db_conn.query(exerciseQuery, (error, results, fields) => {
              if (error) reject(error);
              else resolve(results);
          });
      });
      res.json(results);
  } catch (error) {
      console.error('Exercise retrieval error:', error);
      res.status(500).json({ message: "Server error" });
  }
});

router.post('/workout-list', async (req, res) => {
    const { userId } = req.body;

    try {
        const workoutQuery = 'SELECT workout_id, workout_name, description FROM Workout WHERE creator_id=? ORDER BY workout_name ASC';
  
        const results = await new Promise((resolve, reject) => {
            db_conn.query(workoutQuery, [userId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Exercise retrieval error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/delete-workout', async (req, res) => {
    const { workoutId } = req.body;

    try {
        const assignmentQuery = 'DELETE FROM WorkoutCalendar WHERE workout_id=?';
  
        await new Promise((resolve, reject) => {
            db_conn.query(assignmentQuery, [workoutId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        const workoutQuery1 = 'DELETE FROM Workout_Exercise WHERE workout_id=?';
  
        await new Promise((resolve, reject) => {
            db_conn.query(workoutQuery1, [workoutId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        const workoutQuery2 = 'DELETE FROM Workout WHERE workout_id=?';
  
        const results = await new Promise((resolve, reject) => {
            db_conn.query(workoutQuery2, [workoutId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Exercise removal error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/workout-details', async (req, res) => {
    const { workoutId } = req.body;

    try {
        const workoutQuery = 'SELECT workout_name, set_count, description FROM Workout WHERE workout_id=?';
  
        const workoutResults = await new Promise((resolve, reject) => {
            db_conn.query(workoutQuery, [workoutId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        const exerciseQuery = 'SELECT E.exercise_id, E.exercise_name, WE.reps FROM Workout_Exercise as WE, ExerciseBank as E WHERE WE.exercise_id=E.exercise_id AND workout_id=?';

        const exerciseResults = await new Promise((resolve, reject) => {
            db_conn.query(exerciseQuery, [workoutId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        res.json({
            workout: workoutResults[0],
            exercises: exerciseResults
        });
    } catch (error) {
        console.error('Exercise retrieval error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/create-workout', async (req, res) => {
    const { creatorId, workoutName, setCount, description, exercises } = req.body;
  
    try {
        await new Promise((resolve, reject) => {
            db_conn.query('INSERT INTO Workout (workout_name, creator_id, set_count, description) VALUES (?, ?, ?, ?)', [workoutName, creatorId, setCount, description], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        const results = await new Promise((resolve, reject) => {
            db_conn.query('SELECT * FROM Workout ORDER BY workout_id DESC LIMIT 1', (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        exercises.map(async (exercise, i) => {
            await new Promise((resolve, reject) => {
                db_conn.query('INSERT INTO Workout_Exercise (workout_id, exercise_id, exercise_order, reps) VALUES (?, ?, ?, ?)', [results[0].workout_id, exercise.exercise_id, i, exercise.rep_count], (error, results, fields) => {
                    if (error) reject(error);
                    else resolve(results);
                });
            });
        });
    } catch (error) {
      console.error('Create workout error:', error);
  
      res.status(500).json({ message: "Server error" });
    }
});

router.post('/edit-workout', async (req, res) => {
    const { workoutId, creatorId, workoutName, setCount, description, exercises } = req.body;
  
    try {
        const deleteQuery = 'DELETE FROM Workout_Exercise WHERE workout_id=?';
  
        await new Promise((resolve, reject) => {
            db_conn.query(deleteQuery, [workoutId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        await new Promise((resolve, reject) => {
            db_conn.query('UPDATE Workout SET workout_name=?, creator_id=?, set_count=?, description=? WHERE workout_id=?', [workoutName, creatorId, setCount, description, workoutId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        exercises.map(async (exercise, i) => {
            await new Promise((resolve, reject) => {
                db_conn.query('INSERT INTO Workout_Exercise (workout_id, exercise_id, exercise_order, reps) VALUES (?, ?, ?, ?)', [workoutId, exercise.exercise_id, i, exercise.rep_count], (error, results, fields) => {
                    if (error) reject(error);
                    else resolve(results);
                });
            });
        });
    } catch (error) {
      console.error('Create workout error:', error);
  
      res.status(500).json({ message: "Server error" });
    }
  });

router.post('/assign-workout', async (req, res) => {
    const { userId, workoutId, dayOfWeek } = req.body;
  
    try {
        // Check if user exists
        const checkUserQuery = 'SELECT id FROM Users WHERE id=?';
        const userExists = await new Promise((resolve, reject) => {
            db_conn.query(checkUserQuery, [userId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        if (userExists.length === 0) {
            return res.status(400).json({ message: "User does not exist: " + userId.toString() });
        }

        // Check if workout exists
        const checkWorkoutQuery = 'SELECT workout_id FROM Workout WHERE workout_id=? AND creator_id=?';
        const workoutExists = await new Promise((resolve, reject) => {
            db_conn.query(checkWorkoutQuery, [workoutId, userId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        if (workoutExists.length === 0) {
            return res.status(400).json({ message: "Workout does not exist or is not owned by this user: workout: " + workoutId.toString() + ", user: " + userId.toString() });
        }

        // Check if assignment already exists
        const checkAssignmentQuery = 'SELECT workout_id FROM WorkoutCalendar WHERE workout_id=? AND user_id=? AND day_of_week=?';
        const assignmentExists = await new Promise((resolve, reject) => {
            db_conn.query(checkAssignmentQuery, [workoutId, userId, dayOfWeek], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        if (assignmentExists.length > 0) {
            return res.status(400).json({ message: "Assignment already exists. " });
        }

        // Create the assignment
        await db_conn.query('INSERT INTO WorkoutCalendar (workout_id, user_id, day_of_week) VALUES (?, ?, ?)', [workoutId, userId, dayOfWeek]);
        await new Promise((resolve, reject) => {
            db_conn.query(checkAssignmentQuery, [workoutId, userId, dayOfWeek], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.status(201).json({ message: "Assignment created successfully" });

    } catch (error) {
      console.error('Assign workout error:', error);
  
      res.status(500).json({ message: "Server error" });
    }
});

router.post('/get-assignments', async (req, res) => {
    const { userId } = req.body;

    try {
        const assignmentQuery = 'SELECT W.workout_id, W.workout_name, WC.day_of_week FROM WorkoutCalendar AS WC, Workout AS W WHERE WC.workout_id=W.workout_id AND WC.user_id=? ORDER BY W.workout_name ASC';
  
        const results = await new Promise((resolve, reject) => {
            db_conn.query(assignmentQuery, [userId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Assignment retrieval error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/get-todays-logs', async (req, res) => {
    const { userId } = req.body;

    try {
        // Check if user exists
        const checkUserQuery = 'SELECT id FROM Users WHERE id=?';
        const userExists = await new Promise((resolve, reject) => {
            db_conn.query(checkUserQuery, [userId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        if (userExists.length === 0) {
            return res.status(400).json({ message: "User does not exist: " + userId.toString() });
        }

        // Get the logs for today for the user
        const logQuery = 'SELECT workout_id FROM WorkoutSession WHERE user_id=? AND session_date=?';
        const results = await new Promise((resolve, reject) => {
            db_conn.query(logQuery, [userId, (new Date()).toISOString().split('T')[0]], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Log retrieval error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/unassign-workout', async (req, res) => {
    const { workoutId, userId, dayOfWeek } = req.body;

    try {
        const assignmentQuery = 'DELETE FROM WorkoutCalendar WHERE workout_id=? AND user_id=? AND day_of_week=?';
  
        const results = await new Promise((resolve, reject) => {
            db_conn.query(assignmentQuery, [workoutId, userId, dayOfWeek], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Assignment removal error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/log-session', async (req, res) => {
    const { userId, workoutId, sessionDate, dayOfWeek } = req.body;
  
    try {
        // Check if user exists
        const checkUserQuery = 'SELECT id FROM Users WHERE id=?';
        const userExists = await new Promise((resolve, reject) => {
            db_conn.query(checkUserQuery, [userId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        if (userExists.length === 0) {
            return res.status(400).json({ message: "User does not exist: " + userId.toString() });
        }

        // Check if workout exists
        const checkWorkoutQuery = 'SELECT workout_id FROM Workout WHERE workout_id=? AND creator_id=?';
        const workoutExists = await new Promise((resolve, reject) => {
            db_conn.query(checkWorkoutQuery, [workoutId, userId], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        if (workoutExists.length === 0) {
            return res.status(400).json({ message: "Workout does not exist or is not owned by this user: workout: " + workoutId.toString() + ", user: " + userId.toString() });
        }

        // Check if assignment exists
        const checkAssignmentQuery = 'SELECT workout_id FROM WorkoutCalendar WHERE workout_id=? AND user_id=? AND day_of_week=?';
        const assignmentExists = await new Promise((resolve, reject) => {
            db_conn.query(checkAssignmentQuery, [workoutId, userId, dayOfWeek], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        if (assignmentExists.length === 0) {
            return res.status(400).json({ message: "Workout is not scheduled for today. " });
        }

        // Check if session was already logged for today
        const checkSessionQuery = 'SELECT workout_id FROM WorkoutSession WHERE workout_id=? AND user_id=? AND session_date=?';
        const sessionExists = await new Promise((resolve, reject) => {
            db_conn.query(checkSessionQuery, [workoutId, userId, sessionDate], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        if (sessionExists.length > 0) {
            return res.status(400).json({ message: "Workout session has already been logged today. " });
        }

        // Log the session
        await db_conn.query('INSERT INTO WorkoutSession (workout_id, user_id, session_date) VALUES (?, ?, ?)', [workoutId, userId, sessionDate]);
        await new Promise((resolve, reject) => {
            db_conn.query(checkSessionQuery, [workoutId, userId, dayOfWeek], (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.status(201).json({ message: "Session logged successfully" });

    } catch (error) {
      console.error('Log session error:', error);
  
      res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;