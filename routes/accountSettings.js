const express = require('express');
const db_conn = require('../db_connection');
const router = express.Router();

router.post('/get-account-info', (req, res) => {
    const userId = req.body.userId;
    const query = `SELECT first_name, last_name, email, phone from Users WHERE id = ?;`
    db_conn.query(query, [userId], (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ message: 'Error retrieving account information' });
        }
        res.status(200).json(result[0]);
    });
})

router.post('/update-account-info', (req, res) => {
    const inputData = req.body;
    const values = [
        inputData.first_name,
        inputData.last_name,
        inputData.email,
        inputData.phone,
        inputData.userId,
    ]
    const query = 'UPDATE Users SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE id = ?;'
    db_conn.query(query, values, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ message: 'Error updating account information' });
        }
        res.status(200).json({ message: 'Account information updated successfully' });
    });
})

module.exports = router;



