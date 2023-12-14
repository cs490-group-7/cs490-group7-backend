const express = require('express');
const bcrypt = require('bcrypt');
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

router.post('/change-password', async (req, res) => {
    const {currentPassword, newPassword, userId} = req.body;

    const getQuery = 'select * from Users where id = ?'
    const results = await new Promise((resolve, reject) => {
        db_conn.query(getQuery, [userId], (error, results) => {
            if (error){
                console.error(error)
                return res.status(500).json({ message: 'Server error' });
            }
            resolve(results);
        });
    });

    const validPassword = await bcrypt.compare(currentPassword, results[0].password);
    if (!validPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updateQuery = "UPDATE Users SET password = ? WHERE id = ?";
    db_conn.query(updateQuery, [hashedPassword, userId], (error) => {
        if(error){
            console.error(error)
            return res.status(500).json({ message: 'Server error updating password' });
        }
        res.status(200).json({ message: 'Password updated successfully' });
    });
})

router.post('/delete-account', async (req, res) => {
    const {userId} = req.body;
    const query = "DELETE from Users WHERE id = ?";
    db_conn.query(query, [userId], (error) => {
        if(error){
            console.error(error)
            return res.status(500).json({ message: 'Server error deleting account' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    });
})

module.exports = router;