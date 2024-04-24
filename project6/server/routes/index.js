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
  var sql = "SELECT * from catalog";
  db.query(sql, (err, rows) => {
  
    if(err){
      console.log("SELECT from catalog failed");
      console.log(err);
      return;
    }
    //Render index.pug page using array
    res.render('getCombined', {catalogs: rows});
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
