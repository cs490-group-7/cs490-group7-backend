const express = require('express');
const router = express.Router();
const connection = require('../db_connection');

router.post('/initial-survey', (req, res) => {
    const surveyData = req.body;

    const query = 'INSERT INTO ClientInitialSurvey (user_id, date_of_birth, gender, height, weight, fitness_goal, last_update) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())';
    const values = [
      surveyData.user_id,
      surveyData.date_of_birth,
      surveyData.gender,
      surveyData.height,
      surveyData.weight,
      surveyData.fitness_goal,
    ];

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

    const query = 'INSERT INTO CoachInitialSurvey (user_id, certifications, experience, specializations, last_update) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP())';
    const values = [
      surveyData.user_id,
      surveyData.certifications,
      surveyData.experience,
      surveyData.specializations,
    ];

    connection.query(query, values, (error, result) => {
        if(error){
            console.error(error)
            return res.status(400).json({ message: "Server error" });
        }
        res.status(200).json({ message: 'Coach survey added successfully' });
    });
});

module.exports = router;
