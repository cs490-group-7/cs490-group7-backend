const connection = require('../db_connection');

const ClientInitialSurvey = {
  addInitialSurvey: (surveyData, callback) => {
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
        callback(err, null);
      } else {
        callback(null, results);
      }
    });
  },
};

module.exports = ClientInitialSurvey;
