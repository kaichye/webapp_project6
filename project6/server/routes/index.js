var express = require('express');
var db = require('../db/database.js');
var router = express.Router();
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET home page. */
router.get('/getCombined', function(req, res, next) {
  var sql = "SELECT * FROM plan WHERE planid = 3";
  db.query(sql, function(err, rows) {
  
    if(err){
      console.log("SELECT from plan failed");
      console.log(err);
      return;
    }
    plan_name = rows[0].planname;
    sql = "SELECT * FROM user WHERE userid = 2";
    db.query(sql, plan_name, function(err, rows) {
  
      if(err){
        console.log("SELECT from user failed");
        console.log(err);
        return;
      }
      user = rows[0].userid;
      res.render('getCombined', {user: user, planname: plan_name});
    });
  });
});

/* GET notes. */
// get notes at http://localhost:3000/getNotes?id=3
router.get('/getNotes', function(req, res, next) {
  var sql = "SELECT * from note where studentId = ";
  sql += req.query.id;
  sql += " and ownerId = ";
  sql += req.query.oid;
  db.query(sql, (err, rows) => {
  
    if(err){
      console.log("SELECT from user failed");
      console.log(err);
      return;
    }
    //Render index.pug page using array
    res.render('getNotes', {notes: rows});
  }); 
});

/* GET notes. */
router.get('/getPlanIds', function(req, res, next) {
  var sql = "SELECT * from plan where userid = ";
  sql += req.query.id;
  db.query(sql, (err, rows) => {
  
    if(err){
      console.log("SELECT from plan failed");
      console.log(err);
      return;
    }
    //Render index.pug page using array
    res.render('getPlanIds', {plans: rows});
  }); 
});

module.exports = router;


// TODO change to just get plan name?
// make a file here and combine things?
// do the same thing as .NET separate?