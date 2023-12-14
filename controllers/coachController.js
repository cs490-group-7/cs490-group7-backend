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

   getCurrentClients: async (coachId) => {
    try {
      const query = `SELECT coach_id, client_id, first_name, last_name FROM Coach_Request
        INNER JOIN Users ON Coach_Request.client_id = Users.id
        WHERE Coach_Request.coach_id = ? AND Coach_Request.accepted = TRUE;`;

      const results = await queryAsync(query, [coachId]);
      return results || [];
    } catch (error) {
      console.error('Error retrieving current clients:', error);
      throw new Error('Error retrieving current clients');
    }
  },
  
  getCurrentCoach: async (clientId) => {
    try {
      const query = `SELECT coach_id, client_id, first_name, last_name, specializations, experience, city, state, price, accepted, pending 
        FROM Coach_Request
        INNER JOIN Users ON Coach_Request.coach_id = Users.id
        INNER JOIN CoachInitialSurvey ON Coach_Request.coach_id = CoachInitialSurvey.user_id
        WHERE Coach_Request.client_id = ?;`;
      const results = await queryAsync(query, [clientId]);
      return results[0] || null;
    } catch (error) {
      console.error('Error retrieving current coach:', error);
      throw new Error('Error retrieving current coach');
    }
  },

  removeCoach: async (clientId) => {
    try {
      const query = `DELETE FROM Coach_Request WHERE client_id = ?;`;
      await queryAsync(query, [clientId]);
      return { message: 'Coach removed successfully' };
    } catch (error) {
      console.error('Error removing coach:', error);
      throw new Error('Error removing coach');
    }
  },

  addRemovalReason: async (clientId, coachId, reason) => {
    try {
      const query = `INSERT INTO CoachRemoval (client_id, coach_id, reason) VALUES (?, ?, ?);`;
      await queryAsync(query, [clientId, coachId, reason]);
      return { message: 'Removal reason added successfully' };
    } catch (error) {
      console.error('Error adding removal reason:', error);
      throw new Error('Error adding removal reason');
    }
  },

  getClientProgress: async (clientId) => {
    try {
      const query = 'SELECT * FROM DailySurvey WHERE user_id = ? ORDER BY date DESC';
      const results = await queryAsync(query, [clientId]);
      return results || [];
    } catch (error) {
      console.error('Error fetching client progress:', error);
      throw new Error('Error fetching client progress');
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