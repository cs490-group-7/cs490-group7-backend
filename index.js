const express = require('express');
const db_conn = require('./db_connection');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const dataRoutes = require('./routes/dataRoutes');
// cors added here
const cors = require('cors');
const port = process.env.PORT || 4000;
const app = express();

//cors added here
app.use(cors());
app.use(bodyParser.json());

app.get('/health/check', (req, res) => {
    res.json({ testString: "Hello World From Server!" });
});

app.use('/api/users', userRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/data', dataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => console.log(`Server is successfully listening on port ${port}`));
