const express = require('express');
const db_conn = require('../db_connection');
const router = express.Router();

router.post('/check-approval-status', (req, res) => {
    const { userId } = req.body;
    const query = 'SELECT is_pending_approval FROM CoachInitialSurvey WHERE user_id = ?';

    db_conn.query(query, [userId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error checking approval status' });
        }
        const isPendingApproval = results.length > 0 ? results[0].is_pending_approval : false;
        res.status(200).json({ isPendingApproval });
    });
});
// Endpoint to get current clients for a coach
router.post('/get-current-clients', (req, res) => {
  const coachId = req.body.userId;
  const query = `select coach_id, client_id, first_name, last_name from Coach_Request
      inner join Users on Coach_Request.client_id = Users.id
      where Coach_Request.coach_id = ? AND Coach_Request.accepted = TRUE;`
  db_conn.query(query, [coachId], (error, result) => {
      if(error){
          console.error(error)
          return res.status(500).json({ message: 'Error retrieving current clients' });
      }
      res.status(200).json(result);
  });
})

router.post('/get-current-coach', (req, res) => {
  const clientId = req.body.userId;
  const query = `select coach_id, client_id, first_name, last_name, specializations, experience, city, state, price, accepted, pending from Coach_Request
      inner join Users on Coach_Request.coach_id = Users.id
      inner join CoachInitialSurvey on Coach_Request.coach_id = CoachInitialSurvey.user_id
      where Coach_Request.client_id = ?;`
  db_conn.query(query, [clientId], (error, result) => {
      if(error){
          console.error(error)
          return res.status(500).json({ message: 'Error retrieving current coach' });
      }
      res.status(200).json(result[0]);
  });
})

router.post('/remove-coach', (req, res) => {
  const clientId = req.body.userId;
  const query = `delete from Coach_Request
      where client_id = ?;`
  db_conn.query(query, [clientId], (error, result) => {
      if(error){
          console.error(error)
          return res.status(500).json({ message: 'Error removing coach' });
      }
      res.status(200).json(result);
  });
})

router.post('/removal-reason', (req, res) => {
  const clientId = req.body.userId;
  const coachId = req.body.coachId;
  const reason = req.body.reason;
  const query = `insert into CoachRemoval (client_id, coach_id, reason)
      values (?, ?, ?);`
  db_conn.query(query, [clientId, coachId, reason], (error, result) => {
      if(error){
          console.error(error)
          return res.status(500).json({ message: 'Error removing coach' });
      }
      res.status(200).json(result);
  });
})

// Endpoint to retrieve the progress data for client.
router.post('/client-progress', (req, res) => {
  const clientId = req.body.clientId;
  const query = 'SELECT * FROM DailySurvey WHERE user_id = ? ORDER BY date DESC';

  db_conn.query(query, [clientId], (error, results) => {
      if (error) {
          console.error('Error fetching client progress:', error);
          return res.status(500).json({ message: 'Error fetching client progress' });
      }
      res.status(200).json(results);
  });
});


// Route for coach lookup, fetching only approved coaches
router.post('/coach-lookup', (req, res) => {
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
   
    db_conn.query(query, filterValues, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error retrieving coaches' });
        }
        res.status(200).json(results || []);
    });
});

module.exports = router;