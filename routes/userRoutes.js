const express = require('express');
const bcrypt = require('bcrypt');
const db_conn = require('../db_connection');

const router = express.Router();

// Registration Endpoint
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, phone, isCoach } = req.body;

  try {
    // Check if user already exists
    const checkUserQuery = 'SELECT email FROM Users WHERE email = ?';
    const userExists = await new Promise((resolve, reject) => {
      db_conn.query(checkUserQuery, [email], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists with email: " + email });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into the database
    const userType = isCoach ? 'Coach' : 'Client';
    await db_conn.query('INSERT INTO Users (first_name, last_name, email, password, user_type, phone) VALUES (?, ?, ?, ?, ?, ?)', [firstName, lastName, email, hashedPassword, userType, phone]);

    const userQuery = 'SELECT id FROM Users WHERE email = ?';

    const results = await new Promise((resolve, reject) => {
        db_conn.query(userQuery, [email], (error, results, fields) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
    res.status(201).json({ message: "User registered successfully", ident: results[0].id });
    
    } catch (error) {
      console.error('Registration error:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      //console.error('Duplicate email detected:', error.sqlMessage);
      return res.status(400).json({ message: "Email already exists" + email});
    }

    if (error instanceof SyntaxError) {
      return res.status(400).json({ message: "Invalid request format" });
    }

    if (error instanceof ReferenceError) {
      return res.status(500).json({ message: "Database query error" });
    }

    if (error instanceof TypeError) {
      return res.status(500).json({ message: "Type error" });
    }

    // Handle unexpected errors
    res.status(500).json({ message: "Server error" });
  }
});
//Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // Check if user exists
      const userQuery = 'SELECT * FROM Users WHERE email = ?';

      const results = await new Promise((resolve, reject) => {
          db_conn.query(userQuery, [email], (error, results, fields) => {
              if (error) reject(error);
              else resolve(results);
          });
      });

      // Check if user exists
      if (results.length === 0) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      // Compare passwords
      const validPassword = await bcrypt.compare(password, results[0].password);
      if (!validPassword) {
          return res.status(400).json({ message: "Invalid email or password" });
      }

      res.status(200).json({ message: "Logged in successfully", ident: results[0].id, userType: results[0].user_type });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Server error" });
  }
});

// Initial Coach Search Endpoint
router.post('/coach-details', async (req, res) => {
  const { fname, lname, userId } = req.body;
  try {
    // Retrieve details from CoachInitialSurvey based on first name, last name, and user_id
    const userQuery = 'SELECT CoachInitialSurvey.* FROM CoachInitialSurvey JOIN Users ON CoachInitialSurvey.user_id = Users.id WHERE Users.first_name = ? AND Users.last_name = ? AND Users.id = ?';

    const results = await new Promise((resolve, reject) => {
      db_conn.query(userQuery, [fname, lname, userId], (error, results, fields) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    res.status(200).json({ message: "Coach Detail Search successful", coaches: results });
  } catch (error) {
    console.error('Coach Detail search error:', error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/pending-coaches', (req, res) => {
  const query = `SELECT Users.id, Users.first_name, Users.last_name, CoachInitialSurvey.* 
                 FROM Users 
                 JOIN CoachInitialSurvey ON Users.id = CoachInitialSurvey.user_id 
                 WHERE CoachInitialSurvey.is_pending_approval = TRUE 
                 AND CoachInitialSurvey.is_approved = FALSE;`;
  db_conn.query(query, (error, results) => {
      if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error retrieving pending coaches' });
      }
      res.status(200).json(results);
  });
});

// Update coach approval status
router.post('/update-coach-approval', (req, res) => {
  const { coachId, isApproved } = req.body;
  const query = `UPDATE CoachInitialSurvey 
                 SET is_pending_approval = FALSE, is_approved = ? 
                 WHERE user_id = ?;`;
  db_conn.query(query, [isApproved, coachId], (error, result) => {
      if (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error updating coach approval status' });
      }
      res.status(200).json({ message: 'Coach approval status updated successfully' });
  });
});


router.get('/exercise-bank', async (req, res) => {
  try {
    let exerciseQuery = 'SELECT * FROM ExerciseBank';
    const results = await new Promise((resolve, reject) => {
      db_conn.query(exerciseQuery, (error, results, fields) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
    res.status(200).json(results);
  } catch (error) {
    console.error('Exercise Bank search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add an exercise to the bank
router.post('/add-exercise', (req, res) => {
  const { exercise_name, exercise_type } = req.body;
  const query = 'INSERT INTO ExerciseBank (exercise_name, exercise_type) VALUES (?, ?);';
  db_conn.query(query, [exercise_name, exercise_type], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error adding exercise' });
    }
    res.status(200).json({ message: 'Exercise added successfully' });
  });
});

// Delete an exercise from the bank
router.post('/delete-exercise', (req, res) => {
  const { exercise_id } = req.body;
  const query = 'DELETE FROM ExerciseBank WHERE exercise_id = ?;';
  db_conn.query(query, [exercise_id], (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting exercise' });
    }
    res.status(200).json({ message: 'Exercise deleted successfully' });
  });
});

//Coach Request Endpoint
router.post('/request-coach', async (req, res) => {
  try {
    // Extract coachId from the request body
    const { coachId, clientId } = req.body;

    // Check if the user has already requested this coach
    const checkRequestQuery = 'SELECT * FROM Coach_Request WHERE coach_id = ? AND client_id = ?';
    const requestExists = await new Promise((resolve, reject) => {
      db_conn.query(checkRequestQuery, [coachId, clientId], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    if (requestExists.length > 0) {
      return res.status(400).json({ message: 'You have already requested this coach.' });
    }

    // Insert the request into the Coach_Request table
    const insertRequestQuery = 'INSERT INTO Coach_Request (coach_id, client_id) VALUES (?, ?)';
    await new Promise((resolve, reject) => {
      db_conn.query(insertRequestQuery, [coachId, clientId], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    // Send a success response
    res.status(200).json({ message: 'Coach requested successfully!' });
  } catch (error) {
    console.error('Error requesting coach:', error);
    res.status(500).json({ message: 'An error occurred while requesting the coach.' });
  }
});

router.post('/get-coach-requests', (req, res) => {
  const coachId = req.body.coachId;
  const query = `select coach_id, client_id, first_name, last_name, ClientInitialSurvey.* from Coach_Request
    inner join Users on Coach_Request.client_id = Users.id
    inner join ClientInitialSurvey on Coach_Request.client_id = ClientInitialSurvey.user_id
    where Coach_Request.coach_id = ? AND Coach_Request.pending = TRUE;`
  db_conn.query(query, [coachId], (error, results) => {
      if(error){
          console.error(error)
          return res.status(500).json({ message: 'Error getting requests' });
      }
      res.status(200).json(results);
  });
})

router.post('/handle-request', (req, res) => {
  const {coachId, clientId, isAccepted } = req.body;
  const query = `UPDATE Coach_Request SET pending = FALSE, accepted = ? WHERE coach_id = ? AND client_id = ?`;
    db_conn.query(query, [isAccepted, coachId, clientId], (error, results) => {
      if(error){
        console.error(error)
        return res.status(500).json({ message: 'Error updating coach request' });
      }
      return res.status(200).json({ message: 'Coach request updated succesfully'});
    });
})


module.exports = router;