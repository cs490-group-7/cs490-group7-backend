const connection = require('../db_connection');
const { validationResult } = require('express-validator');

const CoachInitialSurvey = {
  create: (surveyData, callback) => {
    const errors = validationResult(surveyData);

    if (!errors.isEmpty()) {
      return callback(errors.array(), null);
    }

    const query = 'INSERT INTO CoachInitialSurvey (user_id, certifications, experience, specializations) VALUES (?, ?, ?)';
    const values = [
      surveyData.user_id,
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

