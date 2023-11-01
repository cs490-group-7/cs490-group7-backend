const mysql = require('mysql');

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "your_database_name",
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log("Connected to MySQL!");
  }
});

module.exports = connection;
