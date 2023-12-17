const db_conn = require('../db_connection');
const bcrypt = require('bcrypt');

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

  changePassword: async (currentPassword, newPassword, userId) => {
    try {
      const getQuery = 'SELECT * FROM Users WHERE id = ?';
      const results = await queryAsync(getQuery, [userId]);

      const validPassword = await bcrypt.compare(currentPassword, results[0].password);
      if (!validPassword) {
        throw new Error('Current password is incorrect');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const updateQuery = 'UPDATE Users SET password = ? WHERE id = ?';
      await db_conn.query(updateQuery, [hashedPassword, userId]);

      return 'Password updated successfully';
    } catch (error) {
      console.error('Error changing password:', error);
      throw new Error('Error changing password');
    }
  },

  deleteAccountWithReason: async (userId, reason) => {
    try {
      await db_conn.beginTransaction();

      // Insert deletion reason
      const insertReasonQuery = 'INSERT INTO AccountDeletionReasons (reason) VALUES (?)';
      await queryAsync(insertReasonQuery, [reason]);

      // Delete the user account
      const deleteQuery = 'DELETE FROM Users WHERE id = ?';
      await queryAsync(deleteQuery, [userId]);

      // Commit the transaction
      await db_conn.commit();

      return { message: 'Account deleted successfully' };
    } catch (error) {
      console.error('Error during account deletion:', error);
      await db_conn.rollback();
      throw new Error('Error during account deletion');
    }
  },
};

module.exports = AccountController;
