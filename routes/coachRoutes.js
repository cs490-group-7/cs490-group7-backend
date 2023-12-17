const express = require('express');
const CoachController = require('../controllers/coachController');
const router = express.Router();

router.post('/check-approval-status', async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await CoachController.checkApprovalStatus(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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


router.post('/get-current-clients', async (req, res) => {
  try {
    const coachId = req.body.userId;
    const results = await CoachController.getCurrentClients(coachId);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/get-current-coach', async (req, res) => {
  try {
    const clientId = req.body.userId;
    const result = await CoachController.getCurrentCoach(clientId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/remove-coach', async (req, res) => {
  try {
    const clientId = req.body.userId;
    const result = await CoachController.removeCoach(clientId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/removal-reason', async (req, res) => {
  try {
    const clientId = req.body.userId;
    const coachId = req.body.coachId;
    const reason = req.body.reason;
    const result = await CoachController.addRemovalReason(clientId, coachId, reason);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/client-progress', async (req, res) => {
  try {
    const clientId = req.body.clientId;
    const result = await CoachController.getClientProgress(clientId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/coach-lookup', async (req, res) => {
  try {
    const filters = req.body;
    const results = await CoachController.coachLookup(filters);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;