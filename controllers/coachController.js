// coachController.js

const db_conn = require('../db_connection');

class coachController {
  async checkApprovalStatus(req, res) {
    const { userId } = req.body;
    const query = 'SELECT is_pending_approval FROM CoachInitialSurvey WHERE user_id = ?';

    try {
      const results = await this.executeQuery(query, [userId]);
      const isPendingApproval = results.length > 0 ? results[0].is_pending_approval : false;
      res.status(200).json({ isPendingApproval });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error checking approval status' });
    }
  }

  async coachLookup(req, res) {
    const { experience, specializations, city, state, maxPrice } = req.body;
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

    try {
      const results = await this.executeQuery(query, filterValues);
      res.status(200).json(results || []);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving coaches' });
    }
  }

  async executeQuery(query, params) {
    return new Promise((resolve, reject) => {
      db_conn.query(query, params, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  }
}

module.exports = new coachController();
