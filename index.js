const express = require('express');
const db_conn = require('./db_connection');
// adding code here
const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes');
const surveyRoutes = require('./routes')

const port = 4000;
const app = express();

app.use(bodyParser.json());

app.get('/health/check', (req,res) =>{
    res.json({testString: "Hello World From Server!"});
})
//integrate user routes
app.use('/api/users', userRoutes);
app.use('/api/surveys', surveyRoutes);
app.listen(port, () => console.log(`Server is successfully listening on port ${port}`));