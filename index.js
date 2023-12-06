const express = require('express');
const db_conn = require('./db_connection');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const surveyRoutes = require('./routes/surveyRoutes');
const dataRoutes = require('./routes/dataRoutes');
const workoutRoutes = require('./routes/workoutRoutes');
const progressRoutes = require('./routes/progressRoutes');
const accountSettings = require('./routes/accountSettings')
const coachRotues = require('./routes/coachRoutes');
// swagger
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
// cors added here
const cors = require('cors');
const port = process.env.PORT || 4000;
const app = express();

//cors added here
app.use(cors());
app.use(bodyParser.json());

app.get('/health/check', (req, res) => {
    res.status(200).json({ message: "Hello World From Server!" });
});

app.use('/api/users', userRoutes);
app.use('/api/surveys', surveyRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/progress', progressRoutes)
app.use('/api/account', accountSettings)
app.use('/api/coach', coachRotues)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Swagger middleware
app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.listen(port, () => console.log(`Server is successfully listening on port ${port}`));

module.exports = app;

/* Endpoints */
//require('./routes')(app)
