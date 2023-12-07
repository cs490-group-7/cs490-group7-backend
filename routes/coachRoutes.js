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

// Route for coach lookup, fetching only approved coaches
router.post('/coach-lookup', (req, res) => {
    const query = `SELECT Users.id, Users.first_name, Users.last_name FROM Users
        INNER JOIN CoachInitialSurvey ON Users.id = CoachInitialSurvey.user_id
        WHERE CoachInitialSurvey.is_approved = TRUE;`
    
    db_conn.query(query, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error retrieving coaches' });
        }
        res.status(200).json(results || []);
    });
});
module.exports = router;