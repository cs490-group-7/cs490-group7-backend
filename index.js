const express = require('express');
const db_conn = require('./db_connection');

const port = 4000;
const app = express();

app.get('/health/check', (req,res) =>{
    res.json({testString: "Hello World From Server!"});
})

app.listen(port, () => console.log(`Server is successfully listening on port ${port}`));