const express = require('express');
const db_conn = require('../db_connection');
const router = express.Router();

router.post('/get-current-clients', (req, res) => {
    const coachId = req.body.userId;
    const query = `select coach_id, client_id, first_name, last_name from Coach_Client
        inner join Users on Coach_Client.client_id = Users.id
        where Coach_Client.coach_id = ?;`
    db_conn.query(query, [coachId], (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ message: 'Error retrieving current clients' });
        }
        res.status(200).json(result);
    });
})

module.exports = router;