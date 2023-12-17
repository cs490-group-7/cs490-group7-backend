const express = require('express');
const router = express.Router();
const connection = require('../db_connection');

router.post('/initial-survey', (req, res) => {
    const surveyData = req.body;
    const query = 'INSERT INTO ClientInitialSurvey (user_id, date_of_birth, gender, height, weight, weightGoal, weightGoalValue) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [
      surveyData.user_id,
      surveyData.date_of_birth,
      surveyData.gender,
      surveyData.height,
      surveyData.weight,
      surveyData.weightGoal,
      surveyData.weightGoalValue
    ];
    if (surveyData.weightGoal !== "Maintain" && surveyData.weightGoalValue === surveyData.weight){
        return res.status(400).json({ message: "Please use the \"Maintain\" weight goal if you want to keep the same weight" });
    }
    else if (surveyData.weightGoal === "Lose" && surveyData.weightGoalValue > surveyData.weight){
        return res.status(400).json({ message: "Lose weight goal cannot be larger than current weight" });
    }
    else if (surveyData.weightGoal === "Gain" && surveyData.weightGoalValue < surveyData.weight){
        return res.status(400).json({ message: "Gain weight goal cannot be smaller than current weight" });
    }
    connection.query(query, values, (error, result) => {
        if(error){
            console.error(error)
            return res.status(400).json({ message: "Server error" });
        }
        res.status(200).json({ message: 'Initial survey added successfully' });
    });
});

router.post('/coach-survey', (req, res) => {
    const surveyData = req.body;

    const query = 'INSERT INTO CoachInitialSurvey (user_id, experience, specializations, city, state, price) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [
      surveyData.user_id,
      surveyData.experience,
      surveyData.specializations,
      surveyData.city,
      surveyData.state,
      surveyData.price,
    ];

    connection.query(query, values, (error, result) => {
        if(error){
            console.error(error)
            return res.status(400).json({ message: "Server error" });
        }
        res.status(200).json({ message: 'Coach survey added successfully' });
    });
});
router.post('/daily-survey', (req, res) => {
    const surveyData = req.body;

    const query = 'INSERT INTO DailySurvey (user_id, calorie_intake, water_intake, weight, mood) VALUES (?, ?, ?, ?, ?)';
    const values = [
      surveyData.user_id,
      surveyData.calories,
      surveyData.waterIntake,
      surveyData.weight,
      surveyData.mood,
    ];

    connection.query(query, values, (error, result) => {
        if(error){
            if (error.code === 'ER_DUP_ENTRY') {
                console.log("Duplicate Survey Detected");
                return res.status(400).json({ message: "You've already submitted a survey for today" });
            } else {
                console.error(error);
                return res.status(400).json({ message: "Server error" });
            }
        }
        res.status(200).json({ message: 'Daily survey added successfully' });
    });
});


module.exports = router;
