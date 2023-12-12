const db_conn = require('../db_connection');

const dataController = {
  getDashboardMockData: async () => {
    try {
      return {
        "dailyFilled": false,
        "calories": null,
        "waterIntake": null,
        "weight": null,
        "caloriesError": null,
        "waterIntakeError": null,
        "weightError": null,
        "goalMessage": "Lose 30 pounds",
        "goalBaseline": 130,
        "goalTarget": 100,
        "goalCurrent": 115,
        "progress": 0.5,
        "workoutName": "Chest and Triceps Day",
        "workoutCompletion": false,
      };
    } catch (error) {
      console.error('Error getting mock data:', error);
      throw new Error('Error getting mock data');
    }
  },

  getDashboardData: async (userId) => {
    try {
      const query = 'SELECT weight AS goalBaseline, weightGoal, weightGoalValue, (' +
                    'CASE WHEN EXISTS(SELECT weight FROM DailySurvey WHERE user_id=?) ' +
                    'THEN (SELECT weight FROM DailySurvey WHERE user_id=? ORDER BY date DESC LIMIT 1) ' +
                    'ELSE (SELECT weight FROM ClientInitialSurvey WHERE user_id=?) END) AS currentWeight, (' +
                    'SELECT workout_name FROM WorkoutCalendar, Workout WHERE user_id=? AND WorkoutCalendar.workout_id = Workout.workout_id ' +
                    'AND WEEKDAY(CURDATE()) = 6) AS workout_name ' + //Change 6 -> day_of_week
                    'FROM ClientInitialSurvey';
      const results = await new Promise((resolve, reject) => {
        db_conn.query(query, [userId, userId, userId, userId], (error, results, fields) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
      return results[0];
    } catch (error) {
      console.error('Data retrieval error:', error);
      throw new Error('Error retrieving dashboard data');
    }
  },
};

module.exports = dataController;
