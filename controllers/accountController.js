const db_conn = require('../db_connection');

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

const AccountController = {
  getAccountInfo: async (userId) => {
    try {
      const query = 'SELECT first_name, last_name, email, phone FROM Users WHERE id = ?;';
      const result = await queryAsync(query, [userId]);

      if (result.length === 0) {
        throw new Error('User not found');
      }

      return result[0];
    } catch (error) {
      console.error(error);
      throw new Error('Account Details Retrieval Error');
    }
  },

  updateAccountInfo: async (inputData) => {
    try {
      const values = [
        inputData.first_name,
        inputData.last_name,
        inputData.email,
        inputData.phone,
        inputData.userId,
      ];

      const query = 'UPDATE Users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?;';
      await db_conn.query(query, values);

      return { message: 'Account information updated successfully' };
    } catch (error) {
      console.error('Error updating account information:', error);
      throw new Error('Error updating account information');
    }
  },
};

module.exports = AccountController;
