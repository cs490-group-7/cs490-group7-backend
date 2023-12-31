const mysql = require('mysql');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'prod') {
  dotenv.config({ path: '.env.prod' });
} else {
  dotenv.config({ path: '.env.local' });
}

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: 3306,
};
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.log('Error connecting to the database:', err);
  } else {
    console.log("Connected to MySQL!");
  }
});

connection.on('error', (err) => {
  console.error('MySQL connection error:', err);
});

module.exports = connection;