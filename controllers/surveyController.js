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
      if (surveyData.weightGoal !== "Maintain" && surveyData.weightGoalValue === surveyData.weight){
        throw new Error('Please use the \"Maintain\" weight goal if you want to keep the same weight');
    }
    else if (surveyData.weightGoal === "Lose" && surveyData.weightGoalValue > surveyData.weight){
      throw new Error('Lose weight goal cannot be larger than current weight');
    }
    else if (surveyData.weightGoal === "Gain" && surveyData.weightGoalValue < surveyData.weight){
      throw new Error('Gain weight goal cannot be smaller than current weight');
    }
    else if (surveyData.weightGoal === "Maintain" && surveyData.weightGoalValue !== surveyData.weight){
        throw new Error('Maintain weight goal must be equal to current weight');
    }
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
      // Check if a survey was already submitted today
      const currentDate = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format
      const checkQuery = 'SELECT * FROM DailySurvey WHERE user_id = ? AND date = ?';
      const checkValues = [surveyData.user_id, currentDate];

      const results = await new Promise((resolve, reject) => {
      db_conn.query(checkQuery, checkValues, (error, results, fields) => {
        if (results.length > 0) {
        reject(new Error("You've already submitted a survey today"));
      }
      if (error) reject(error);
      else resolve(results);
    });
    });

      const query = 'INSERT INTO DailySurvey (user_id, date, calorie_intake, water_intake, weight, mood) VALUES (?, ?, ?, ?, ?, ?)';
      const values = [
        surveyData.user_id,
        currentDate,
        surveyData.calories,
        surveyData.waterIntake,
        surveyData.weight,
        surveyData.mood,
      ];
    
      await db_conn.query(query, values);
    
      return { message: 'Daily survey added successfully' };
    } catch (error) {
      // Check if the error is a duplicate entry error
      if (error.errno === 1062) {
        return { message: "You've already submitted a survey for today" };
      }
    
      console.error('Error adding daily survey:', error);
      throw new Error('Error adding daily survey');
    }
  },
  
};

module.exports = surveyController;
