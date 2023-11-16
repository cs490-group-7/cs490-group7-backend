const express = require('express');
const db_conn = require('../db_connection');

const router = express.Router();

router.get('/exercise-bank', async (req, res) => {
  try {
      const exerciseQuery = 'SELECT exercise_id, exercise_name FROM fitness_app.ExerciseBank ORDER BY exercise_name ASC';

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

router.get('/workout-list', async (req, res) => {
    try {
        const workoutQuery = 'SELECT workout_id, workout_name, description FROM fitness_app.Workout ORDER BY workout_name ASC';
  
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

router.post('/create-workout', async (req, res) => {
    const { workoutName, setCount, description, exercises} = req.body;
  
    try {
        await new Promise((resolve, reject) => {
            db_conn.query('INSERT INTO Workout (workout_name, set_count, description) VALUES (?, ?, ?)', [workoutName, setCount, description], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        const results = await new Promise((resolve, reject) => {
            db_conn.query('SELECT * FROM fitness_app.Workout ORDER BY workout_id DESC LIMIT 1', (error, results, fields) => {
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

module.exports = router;