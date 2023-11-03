const express = require('express');
const db_conn = require('./db_connection');

const bodyParser = require('body-parser');
const userRoutes = require('./userRoutes');
const clientSurveyRoutes = require('./routes/clientRoutes');
const coachSurveyRoutes = require('./routes/coachRoutes');

const port = 4000;
const app = express();

app.use(bodyParser.json());

app.get('/health/check', (req,res) =>{
    res.json({testString: "Hello World From Server!"});
})

app.use('/api/users', userRoutes);
app.use('/api/surveys', clientSurveyRoutes);
app.use('/api/surveys', coachSurveyRoutes);
app.listen(port, () => console.log(`Server is successfully listening on port ${port}`));