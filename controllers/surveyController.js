const db_conn = require('../db_connection');

const surveyController = {
  addInitialSurvey: async (surveyData) => {
    try {
      const query = 'INSERT INTO ClientInitialSurvey (user_id, date_of_birth, gender, height, weight, weightGoal, weightGoalValue) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [
        surveyData.user_id,
        surveyData.date_of_birth,
        surveyData.gender,
        surveyData.height,
        surveyData.weight,
        surveyData.weightGoal,
        surveyData.weightGoalValue,
      ];
      await db_conn.query(query, values);
    } catch (error) {
      console.error('Error adding initial survey:', error);
      throw new Error('Error adding initial survey');
    }
  },

  addCoachSurvey: async (surveyData) => {
    try {
      const query = 'INSERT INTO CoachInitialSurvey (user_id, experience, specializations, city, state, price) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [
        surveyData.user_id,
        surveyData.experience,
        surveyData.specializations,
        surveyData.city,
        surveyData.state,
        surveyData.price,
      ];
      await db_conn.query(query, values);
    } catch (error) {
      console.error('Error adding coach survey:', error);
      throw new Error('Error adding coach survey');
    }
  },

  addDailySurvey: async (surveyData) => {
    try {
      const query = 'INSERT INTO DailySurvey (user_id, calorie_intake, water_intake, weight, mood) VALUES (?, ?, ?, ?, ?)';
      const values = [
        surveyData.user_id,
        surveyData.calories,
        surveyData.waterIntake,
        surveyData.weight,
        surveyData.mood,
      ];
      await db_conn.query(query, values);
    } catch (error) {
      console.error('Error adding daily survey:', error);
      throw new Error('Error adding daily survey');
    }
  },
};

module.exports = surveyController;
