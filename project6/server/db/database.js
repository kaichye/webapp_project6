var mysql = require('mysql');
var md5 = require('md5');

var db = mysql.createConnection({
    host: "163.11.239.173", 
    database: "project5", 
    user: "root", 
    password: ""
});

db.connect(function(err){
    if (err) throw err;
    console.log("Connected!");
});

module.exports = db;