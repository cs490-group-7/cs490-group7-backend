const db_conn = require('../db_connection');

class accountController {
  async getAccountInfo(req, res) {
    const userId = req.body.userId;
    const query = 'SELECT first_name, last_name, email, phone from Users WHERE id = ?;';
    try {
      const result = await this.executeQuery(query, [userId]);
      res.status(200).json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving account information' });
    }
  }

  async updateAccountInfo(req, res) {
    const inputData = req.body;
    const values = [
      inputData.first_name,
      inputData.last_name,
      inputData.email,
      inputData.phone,
      inputData.userId,
    ];
    const query = 'UPDATE Users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?;';
    try {
      await this.executeQuery(query, values);
      res.status(200).json({ message: 'Account information updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating account information' });
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

module.exports = new accountController();
