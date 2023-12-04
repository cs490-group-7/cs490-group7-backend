const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:4000'
};

const outputFile = './swagger-output.json';
const routes = ['./routes/accountSettings.js', './routes/coachRoutes.js', './routes/dataRoutes.js',
 './routes/progressRoutes.js', './routes/surveyRoutes.js', './routes/userRoutes.js', './routes/workoutRoutes.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);