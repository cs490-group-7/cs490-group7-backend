const db_conn = require('../db_connection');

const progressController = {
  getProgressData: async (userId) => {
    try {
      const query = 'SELECT date, weight, calorie_intake, water_intake FROM DailySurvey WHERE user_id = ?';
      const results = await new Promise((resolve, reject) => {
        db_conn.query(query, [userId], (error, results, fields) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
      return results;
    } catch (error) {
      console.error('Data retrieval error:', error);
      throw new Error('Error retrieving progress data');
    }
  },

  getGoalInfo: async (userId) => {
    try {
      const query = 'SELECT weightGoal, weightGoalValue FROM ClientInitialSurvey WHERE user_id = ?';
      const results = await new Promise((resolve, reject) => {
        db_conn.query(query, [userId], (error, results, fields) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
      return results[0];
    } catch (error) {
      console.error('Data retrieval error:', error);
      throw new Error('Error retrieving goal info');
    }
  },

  getCurrentWeight: async (userId) => {
    try {
      const query = 'SELECT (CASE WHEN EXISTS(SELECT weight FROM DailySurvey WHERE user_id= ?) ' +
                    'THEN (SELECT weight FROM DailySurvey WHERE user_id=? ORDER BY date DESC LIMIT 1) ' +
                    'ELSE (SELECT weight FROM ClientInitialSurvey WHERE user_id= ?) END) AS weight';
      const results = await new Promise((resolve, reject) => {
        db_conn.query(query, [userId, userId, userId], (error, results, fields) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
      return results[0];
    } catch (error) {
      console.error('Data retrieval error:', error);
      throw new Error('Error retrieving current weight');
    }
  },

  updateGoalInfo: async (inputData) => {
    try {
      const values = [
        inputData.weightGoal,
        inputData.weightGoalValue,
        inputData.userId,
      ];
      const query = 'UPDATE ClientInitialSurvey SET weightGoal = ?, weightGoalValue = ? WHERE user_id = ?;';
      await new Promise((resolve, reject) => {
        db_conn.query(query, values, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      return { message: 'Goal updated successfully' };
    } catch (error) {
      console.error('Error updating goal info:', error);
      throw new Error('Error updating goal info');
    }
  },
};

module.exports = progressController;
