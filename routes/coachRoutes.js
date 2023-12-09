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