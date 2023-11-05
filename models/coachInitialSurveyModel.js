const connection = require('../db_connection');
const { validationResult } = require('express-validator');

const CoachInitialSurvey = {
  addInitialSurvey: (surveyData, callback) => {
    const errors = validationResult(surveyData);

    if (!errors.isEmpty()) {
      return callback(errors.array(), null);
    }

    const query = 'INSERT INTO CoachInitialSurvey (dateOfBirth, gender, height, weight, fitnessGoal, certifications, experience, specializations) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [
      surveyData.dateOfBirth,
      surveyData.gender,
      surveyData.height,
      surveyData.weight,
      surveyData.fitnessGoal,
      surveyData.certifications,
      surveyData.experience,
      surveyData.specializations,
    ];

    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Database error:', err);
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },
};

module.exports = CoachInitialSurvey;

