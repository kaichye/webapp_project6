var express = require('express');
var db = require('../db/database.js');
var router = express.Router();

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

module.exports = router;


// TODO change to just get plan name?
// make a file here and combine things?
// do the same thing as .NET separate?