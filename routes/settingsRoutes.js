const express = require('express');
const db_conn = require('../db_connection');
const router = express.Router();

router.post('/account-info', (req, res) => {
    const userId = req.body.userId;
    const query = 'SELECT '
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
})

module.exports = router;



