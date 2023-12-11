// surveyController.js

const db_conn = require('../db_connection');

class surveyController {
  async getCoachSurvey(req, res) {
    const { userId } = req.body;
    const query = 'SELECT * FROM CoachInitialSurvey WHERE user_id = ?';

    try {
      const results = await this.executeQuery(query, [userId]);
      res.status(200).json(results[0] || {});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving coach survey' });
    }
  }

  async getClientSurvey(req, res) {
    const { userId } = req.body;
    const query = 'SELECT * FROM ClientInitialSurvey WHERE user_id = ?';

    try {
      const results = await this.executeQuery(query, [userId]);
      res.status(200).json(results[0] || {});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving client survey' });
    }
  }

  async updateCoachSurvey(req, res) {
    const inputData = req.body;
    const values = [
      inputData.experience,
      inputData.specializations,
      inputData.city,
      inputData.state,
      inputData.price,
      inputData.userId,
    ];
    const query = `INSERT INTO CoachInitialSurvey (experience, specializations, city, state, price, user_id) VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE experience = VALUES(experience), specializations = VALUES(specializations),
      city = VALUES(city), state = VALUES(state), price = VALUES(price);`;

    try {
      await this.executeQuery(query, values);
      res.status(200).json({ message: 'Coach survey updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating coach survey' });
    }
  }

  async updateClientSurvey(req, res) {
    const inputData = req.body;
    const values = [
      inputData.age,
      inputData.gender,
      inputData.fitnessGoal,
      inputData.fitnessLevel,
      inputData.userId,
    ];
    const query = `INSERT INTO ClientInitialSurvey (age, gender, fitness_goal, fitness_level, user_id) VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE age = VALUES(age), gender = VALUES(gender),
      fitness_goal = VALUES(fitness_goal), fitness_level = VALUES(fitness_level);`;

    try {
      await this.executeQuery(query, values);
      res.status(200).json({ message: 'Client survey updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating client survey' });
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

module.exports = new surveyController();
