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

const chatController = {
  sendMessage: async ({ user_id, user_type, coach_id, client_id, message }) => {
    try {
      const from_coach = user_type === 'Coach';
      const actual_coach_id = from_coach ? user_id : coach_id;
      const actual_client_id = from_coach ? client_id : user_id;

      // Check if the chat_id exists
      const checkQuery = 'SELECT * FROM Chat WHERE coach_id = ? AND client_id = ?';
      const checkResults = await queryAsync(checkQuery, [actual_coach_id, actual_client_id]);

      if (checkResults.length === 0) {
        // If the chat_id doesn't exist, create a new chat
        const createQuery = 'INSERT INTO Chat (coach_id, client_id) VALUES (?, ?)';
        await queryAsync(createQuery, [actual_coach_id, actual_client_id]);
      }

      // Save the message to the database
      const query = 'INSERT INTO Message (chat_id, from_coach, message) VALUES ((SELECT chat_id FROM Chat WHERE coach_id = ? AND client_id = ?), ?, ?)';
      await queryAsync(query, [actual_coach_id, actual_client_id, from_coach, message]);

      return { message: 'Message saved successfully.' };
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('An error occurred while sending the message.');
    }
  },
  
  getMessages: async ({ coach_id, client_id }) => {
    try {
      // Get the chat_id
      const getChatIdQuery = 'SELECT chat_id FROM Chat WHERE coach_id = ? AND client_id = ?';
      const chatIdResults = await queryAsync(getChatIdQuery, [coach_id, client_id]);

      if (chatIdResults.length === 0) {
        throw new Error('No chat found between the specified coach and client.');
      }

      const chat_id = chatIdResults[0].chat_id;

      // Get the messages
      const getMessagesQuery = 'SELECT from_coach, message FROM Message WHERE chat_id = ? ORDER BY sent_at';
      const messages = await queryAsync(getMessagesQuery, [chat_id]);

      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw new Error('An error occurred while getting the messages.');
    }
  },
};

module.exports = chatController;
