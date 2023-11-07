const connection = require('../db_connection');
const { validationResult } = require('express-validator');

const ClientInitialSurvey = {
  create: (surveyData, callback) => { // Change function name to 'create'
    const errors = validationResult(surveyData);

    if (!errors.isEmpty()) {
      return callback(errors.array(), null);
    }

    const query = 'INSERT INTO ClientInitialSurvey (dateOfBirth, gender, height, weight, fitnessGoal) VALUES (?, ?, ?, ?, ?)';
    const values = [
      surveyData.dateOfBirth,
      surveyData.gender,
      surveyData.height,
      surveyData.weight,
      surveyData.fitnessGoal,
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

module.exports = ClientInitialSurvey;
