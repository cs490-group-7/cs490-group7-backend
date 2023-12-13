const bcrypt = require('bcrypt');
const db_conn = require('../db_connection');

const UserController = {
  registerUser: async (req, res) => {
    const { firstName, lastName, email, password, phone, isCoach } = req.body;

    try {
      // Check if user already exists
      const userExists = await UserController.checkUserExists(email);
      if (userExists) {
        return res.status(400).json({ message: `User already exists with email: ${email}` });
      }

      // Hash the password
      const hashedPassword = await UserController.hashPassword(password);

      // Insert user into the database
      const userType = isCoach ? 'Coach' : 'Client';
      const result = await db_conn.query(
        'INSERT INTO Users (first_name, last_name, email, password, user_type, phone) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, hashedPassword, userType, phone]
      );

      const userId = result.insertId; // Assuming this is how you retrieve the new user's ID

      return res.status(201).json({ message: 'User registered successfully', ident: userId });
    } catch (error) {
      UserController.handleRegistrationError(error, res);
    }
  },

  login: async (email, password) => {
    try {
      // Check if user exists
      const userQuery = 'SELECT * FROM Users WHERE email = ?';

      const results = await new Promise((resolve, reject) => {
        db_conn.query(userQuery, [email], (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });

      // Check if user exists
      if (results.length === 0) {
        throw new Error('Invalid email or password');
      }

      // Compare passwords
      const storedPassword = results[0].password;

      if (!storedPassword) {
        throw new Error('Invalid email or password');
      }

      const validPassword = await bcrypt.compare(password, storedPassword);

      if (!validPassword) {
        throw new Error('Invalid email or password');
      }

      return {
        message: 'Logged in successfully',
        ident: results[0].id,
        userType: results[0].user_type,
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid email or password');
    }
  },

  coachDetails: async (fname, lname, userId) => {
    try {
      // Retrieve details from CoachInitialSurvey based on first name, last name, and user_id
      const query = 'SELECT CoachInitialSurvey.* FROM CoachInitialSurvey JOIN Users ON CoachInitialSurvey.user_id = Users.id WHERE Users.first_name = ? AND Users.last_name = ? AND Users.id = ?';

      const results = await new Promise((resolve, reject) => {
        db_conn.query(query, [fname, lname, userId], (error, results, fields) => {
          if (error) reject(error);
          else resolve(results);
        });
      });

      return { message: 'Coach Detail Search successful', coaches: results };
    } catch (error) {
      console.error('Coach Detail search error:', error);
      throw new Error('Server error');
    }
  },

  getPendingCoaches: async () => {
    try {
      const query = `SELECT Users.id, Users.first_name, Users.last_name, CoachInitialSurvey.* 
                     FROM Users 
                     JOIN CoachInitialSurvey ON Users.id = CoachInitialSurvey.user_id 
                     WHERE CoachInitialSurvey.is_pending_approval = TRUE 
                     AND CoachInitialSurvey.is_approved = FALSE;`;

      const results = await new Promise((resolve, reject) => {
        db_conn.query(query, (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });

      return results;
    } catch (error) {
      console.error(error);
      throw new Error('Error retrieving pending coaches');
    }
  },

  updateCoachApprovalStatus: async (coachId, isApproved) => {
    try {
      const query = `UPDATE CoachInitialSurvey 
                     SET is_pending_approval = FALSE, is_approved = ? 
                     WHERE user_id = ?;`;

      await new Promise((resolve, reject) => {
        db_conn.query(query, [isApproved, coachId], (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });

      return { message: 'Coach approval status updated successfully' };
    } catch (error) {
      console.error(error);
      throw new Error('Error updating coach approval status');
    }
  },
  // Helper functions
  checkUserExists: async (email) => {
    const checkUserQuery = 'SELECT email FROM Users WHERE email = ?';
    const userExists = await new Promise((resolve, reject) => {
      db_conn.query(checkUserQuery, [email], (error, results) => {
        if (error) reject(error);
        else resolve(results.length > 0);
      });
    });
    return userExists;
  },

  hashPassword: async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  },

  getUserIdByEmail: async (email) => {
    const userQuery = 'SELECT id FROM Users WHERE email = ?';
    const results = await new Promise((resolve, reject) => {
      db_conn.query(userQuery, [email], (error, results) => {
        if (error) reject(error);
        else resolve(results[0].id);
      });
    });
    return results;
  },

  handleRegistrationError: (error, res) => {
    console.error('Registration error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: `Email already exists: ${error.sqlMessage}` });
    }

    if (error instanceof SyntaxError) {
      return res.status(400).json({ message: 'Invalid request format' });
    }

    if (error instanceof ReferenceError) {
      return res.status(500).json({ message: 'Database query error' });
    }

    if (error instanceof TypeError) {
      return res.status(500).json({ message: 'Type error' });
    }

    // Handle unexpected errors
    res.status(500).json({ message: 'Server error' });
  },

  getExerciseBank: async () => {
    try {
      const exerciseQuery = 'SELECT * FROM ExerciseBank';
      const results = await new Promise((resolve, reject) => {
        db_conn.query(exerciseQuery, (error, results, fields) => {
          if (error) reject(error);
          else resolve(results);
        });
      });
      return results;
    } catch (error) {
      console.error('Exercise Bank search error:', error);
      throw new Error('Server error');
    }
  },

  addExercise: async (exercise_name, exercise_type) => {
    try {
      const query = 'INSERT INTO ExerciseBank (exercise_name, exercise_type) VALUES (?, ?);';
      await new Promise((resolve, reject) => {
        db_conn.query(query, [exercise_name, exercise_type], (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      return { message: 'Exercise added successfully' };
    } catch (error) {
      console.error(error);
      throw new Error('Error adding exercise');
    }
  },

  deleteExercise: async (exercise_id) => {
    try {
      const query = 'DELETE FROM ExerciseBank WHERE exercise_id = ?;';
      await new Promise((resolve, reject) => {
        db_conn.query(query, [exercise_id], (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      return { message: 'Exercise deleted successfully' };
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting exercise');
    }
  },

  requestCoach: async (coachId, clientId) => {
    try {
      const checkRequestQuery = 'SELECT * FROM Coach_Request WHERE coach_id = ? AND client_id = ?';
      const requestExists = await new Promise((resolve, reject) => {
        db_conn.query(checkRequestQuery, [coachId, clientId], (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });

      if (requestExists.length > 0) {
        throw new Error('You have already requested this coach.');
      }

      const insertRequestQuery = 'INSERT INTO Coach_Request (coach_id, client_id) VALUES (?, ?)';
      await new Promise((resolve, reject) => {
        db_conn.query(insertRequestQuery, [coachId, clientId], (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });

      return { message: 'Coach requested successfully!' };
    } catch (error) {
      console.error('Error requesting coach:', error);
      throw new Error('An error occurred while requesting the coach.');
    }
  },

  getCoachRequests: async (coachId) => {
    try {
      const query = `SELECT coach_id, client_id, first_name, last_name, ClientInitialSurvey.* FROM Coach_Request
        INNER JOIN Users ON Coach_Request.client_id = Users.id
        INNER JOIN ClientInitialSurvey ON Coach_Request.client_id = ClientInitialSurvey.user_id
        WHERE Coach_Request.coach_id = ? AND Coach_Request.pending = TRUE;`;

      const results = await new Promise((resolve, reject) => {
        db_conn.query(query, [coachId], (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });

      return results;
    } catch (error) {
      console.error(error);
      throw new Error('Error getting requests');
    }
  },

  handleRequest: async (coachId, clientId, isAccepted) => {
    try {
      const query = `UPDATE Coach_Request SET pending = FALSE, accepted = ? WHERE coach_id = ? AND client_id = ?`;

      await new Promise((resolve, reject) => {
        db_conn.query(query, [isAccepted, coachId, clientId], (error, results) => {
          if (error) reject(error);
          else resolve(results);
        });
      });

      return { message: 'Coach request updated successfully' };
    } catch (error) {
      console.error(error);
      throw new Error('Error updating coach request');
    }
  },

  
};

module.exports = UserController;
