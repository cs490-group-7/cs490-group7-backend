const express = require('express');
const bcrypt = require('bcrypt');
const db_conn = require('../db_connection');

const router = express.Router();

// Registration Endpoint
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, isCoach } = req.body;

  try {
    // Check if user already exists
    const userExists = await db_conn.query('SELECT email FROM Users WHERE email = ?', [email]);
    if (userExists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into the database
    const userType = isCoach ? 'Coach' : 'Client';
    await db_conn.query('INSERT INTO Users (first_name, last_name, email, password, user_type) VALUES (?, ?, ?, ?, ?)', [firstName, lastName, email, hashedPassword, userType]);

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

      res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


