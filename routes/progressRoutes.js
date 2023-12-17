const express = require('express');
const db_conn = require('../db_connection');

const router = express.Router();

router.post('/progress-data', async (req, res) => {
    const userId = req.body.userId;
    try {
        const query = 'SELECT date, weight, calorie_intake, water_intake FROM DailySurvey WHERE user_id = ?';
        const results = await new Promise((resolve, reject) => {
            db_conn.query(query, [userId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.json(results);
    } catch (error) {
        console.error('Data retrieval error:', error);
        res.status(500).json({ message: "Error retrieving progress data" });
    }
});

router.post('/goal-info', async (req, res) => {
    const userId = req.body.userId;
    try {
        const query = 'SELECT weightGoal, weightGoalValue FROM ClientInitialSurvey WHERE user_id = ?';
        const results = await new Promise((resolve, reject) => {
            db_conn.query(query, [userId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.json(results[0]);
    } catch (error) {
        console.error('Data retrieval error:', error);
        res.status(500).json({ message: "Error retrieving progress data" });
    }
});

router.post('/current-weight', async (req, res) => {
    const userId = req.body.userId;
    try {
        const query = 'SELECT (CASE WHEN EXISTS(SELECT weight FROM DailySurvey WHERE user_id= ?) THEN (SELECT weight FROM DailySurvey WHERE user_id=? ORDER BY date DESC LIMIT 1) ELSE (SELECT weight FROM ClientInitialSurvey WHERE user_id= ?) END) AS weight';
        const results = await new Promise((resolve, reject) => {
            db_conn.query(query, [userId, userId, userId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        res.json(results[0]);
    } catch (error) {
        console.error('Data retrieval error:', error);
        res.status(500).json({ message: "Error retrieving progress data" });
    }
});

router.post('/update-goal-info', (req, res) => {
    const inputData = req.body;
    
    if (inputData.weightGoal !== "Maintain" && inputData.weightGoalValue == inputData.currentWeight){
        return res.status(400).json({ message: "Please use the \"Maintain\" weight goal if you want to keep the same weight" });
    }
    else if (inputData.weightGoal === "Lose" && inputData.weightGoalValue > inputData.currentWeight){
        return res.status(400).json({ message: "Lose weight goal cannot be larger than current weight" });
    }
    else if (inputData.weightGoal === "Gain" && inputData.weightGoalValue < inputData.currentWeight){
        return res.status(400).json({ message: "Gain weight goal cannot be smaller than current weight" });
    }

    if (inputData.createNew === true){
        if (inputData.weightGoal === "Maintain" && inputData.weightGoalValue !== inputData.currentWeight){
            return res.status(400).json({ message: "Maintain weight goal must be equal to current weight" });
        }
        const values = [
            inputData.currentWeight,
            inputData.weightGoal,
            inputData.weightGoalValue,
            inputData.userId
        ]
        const query = 'UPDATE ClientInitialSurvey SET weight = ?, weightGoal = ?, weightGoalValue = ? WHERE user_id = ?;'
        db_conn.query(query, values, (error, result) => {
            if(error){
                console.error(error)
                return res.status(500).json({ message: 'Error creating goal' });
            }
            res.status(200).json({ message: 'New goal created successfully' });
        });
    }
    else{
        const values = [
            inputData.weightGoalValue,
            inputData.userId
        ]
        const query = 'UPDATE ClientInitialSurvey SET weightGoalValue = ? WHERE user_id = ?;'
        db_conn.query(query, values, (error, result) => {
            if(error){
                console.error(error)
                return res.status(500).json({ message: 'Error updating goal' });
            }
            res.status(200).json({ message: 'Goal updated successfully' });
        });
    }
})

router.post('/workout-progress', async (req, res) => {
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

        // Get the logs for the user
        const logQuery = 'SELECT WS.session_id, WS.session_date, SUM(WE.reps)*W.set_count AS listed, SUM(SE.reps) AS completed ' +
            'FROM SessionExercise as SE, WorkoutSession as WS, Workout_Exercise as WE, Workout AS W ' +
            'WHERE WS.workout_id=W.workout_id AND SE.workout_id=WE.workout_id AND SE.exercise_order=WE.exercise_order AND WS.session_id=SE.session_id AND WS.user_id=? ' +
            'GROUP BY SE.session_id;';
        const sessions = await new Promise((resolve, reject) => {
            db_conn.query(logQuery, [userId], (error, results, fields) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        
        res.json(sessions);
    } catch (error) {
        console.error('Log retrieval error:', error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;