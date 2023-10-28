var mysql = require('mysql');

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "passsword"
});

conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected to MySQL!");
});

module.exports = conn;