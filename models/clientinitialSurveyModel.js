const connection = require('../db_connection');
const { validationResult } = require('express-validator');

const ClientInitialSurvey = {
  create: (surveyData, callback) => { // Change function name to 'create'
    const errors = validationResult(surveyData);

    if (!errors.isEmpty()) {
      return callback(errors.array(), null);
    }

    const query = 'INSERT INTO ClientInitialSurvey (date_of_birth, gender, height, weight, fitness_goal) VALUES (?, ?, ?, ?, ?)';
    const values = [
      surveyData.date_of_birth,
      surveyData.gender,
      surveyData.height,
      surveyData.weight,
      surveyData.fitness_goal,
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
