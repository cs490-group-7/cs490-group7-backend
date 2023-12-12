const db_conn = require('../db_connection');

const coachController = {
  checkApprovalStatus: async (userId) => {
    try {
      const query = 'SELECT is_pending_approval FROM CoachInitialSurvey WHERE user_id = ?';
      const results = await queryAsync(query, [userId]);
      const isPendingApproval = results.length > 0 ? results[0].is_pending_approval : false;
      return { isPendingApproval };
    } catch (error) {
      console.error('Error checking approval status:', error);
      throw new Error('Error checking approval status');
    }
  },

  coachLookup: async (filters) => {
    try {
      const { experience, specializations, city, state, maxPrice } = filters;
      let query = `SELECT Users.id, Users.first_name, Users.last_name FROM Users
        INNER JOIN CoachInitialSurvey ON Users.id = CoachInitialSurvey.user_id
        WHERE CoachInitialSurvey.is_approved = TRUE`;

      // Add filters based on user input
      const filterConditions = [];
      const filterValues = [];

      if (experience) {
        filterConditions.push('CoachInitialSurvey.experience >= ?');
        filterValues.push(experience);
      }

      if (specializations) {
        filterConditions.push('CoachInitialSurvey.specializations = ?');
        filterValues.push(specializations);
      }

      if (city) {
        filterConditions.push('CoachInitialSurvey.city = ?');
        filterValues.push(city);
      }

      if (state) {
        filterConditions.push('CoachInitialSurvey.state = ?');
        filterValues.push(state);
      }

      if (maxPrice) {
        filterConditions.push('CoachInitialSurvey.price <= ?');
        filterValues.push(maxPrice);
      }

      if (filterConditions.length > 0) {
        query += ` AND ${filterConditions.join(' AND ')}`;
      }

      const results = await queryAsync(query, filterValues);
      return results || [];
    } catch (error) {
      console.error('Error retrieving coaches:', error);
      throw new Error('Error retrieving coaches');
    }
  },
};

const queryAsync = (sql, values) => {
  return new Promise((resolve, reject) => {
    db_conn.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = coachController;