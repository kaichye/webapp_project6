var express = require('express');
var db = require('../db/database.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var sql = "SELECT * from catalog";
  db.query(sql, (err, rows) => {
  
    if(err){
      console.log("SELECT from catalog failed");
      console.log(err);
      return;
    }
    //Render index.pug page using array
    res.render('index', {catalogs: rows});
  });
});

//not going to work yet bc we don't have login.pug
router.get('/login', function(req, res, next){
  res.render('login', {title: "login" ,error : ""})
});

module.exports = router;
