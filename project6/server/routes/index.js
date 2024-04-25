var express = require('express');
var db = require('../db/database.js');
var router = express.Router();
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.use(express.static('public'));

/* GET combined */
router.get('/getCombined', function(req, res, next) {
  var sql = "SELECT * FROM plan WHERE planid = ";
  sql += req.query.planid;
  db.query(sql, function(err, rows) {
  
    if(err){
      console.log("SELECT from plan failed");
      console.log(err);
      return;
    }
    plan_name = rows[0].planname;
    sql = "SELECT * FROM user WHERE userid = ";
    sql += req.query.userid;
    db.query(sql, function(err, rows) {
  
      if(err){
        console.log("SELECT from user failed");
        console.log(err);
        return;
      }
      user = rows[0].name;
      sql = "SELECT * FROM plan join planmajor on plan.planid = planmajor.planid WHERE plan.planid = ";
      sql += req.query.planid;
      db.query(sql, function(err, rows) {
    
        if(err){
          console.log("SELECT from plan join planmajor failed");
          console.log(err);
          return;
        }
        majors = "";
        for (let i =0; i < rows.length; i++) {
          majors += rows[i].major += ", ";
        }
        majors = majors.substring(0, majors.length - 2);
        sql = "SELECT * FROM plan join take on plan.planid = take.planid WHERE plan.planid = ";
        sql += req.query.planid;
        sql += " ORDER BY year asc, CASE WHEN term = 'Spring' THEN 1 WHEN term = 'Summer' THEN 2 WHEN term = 'Fall' THEN 3 END";
        db.query(sql, function(err, rows) {
      
          if(err){
            console.log("SELECT from plan join take failed");
            console.log(err);
            return;
          }
          courses = '';
          for (let i =0; i < rows.length; i++) {
            courses += '"' + rows[i].courseid + '":{';
            courses += '"id":"' + rows[i].courseid + '",';
            courses += '"year":"' + rows[i].year + '",';
            courses += '"term":"' + rows[i].term + '"},';
          }
          courses = courses.substring(0, courses.length - 2);
          sql = "SELECT * FROM catalogcourse join course on catalogcourse.courseid = course.courseid";
          db.query(sql, function(err, rows) {
        
            if(err){
              console.log("SELECT from plan join take failed");
              console.log(err);
              return;
            }
            catalog = '';
            for (let i =0; i < rows.length; i++) {
              catalog += '"' + rows[i].courseid + '":{';
              catalog += '"id":"' + rows[i].courseid + '",';
              catalog += '"name":"' + rows[i].title + '",';
              catalog += '"description":"' + rows[i].description + '",';
              catalog += '"credits":' + rows[i].credits + '},';
            }
            catalog = catalog.substring(0, catalog.length - 2);
            res.render('getCombined', {user: user, planname: plan_name, majors: majors, courses: courses, catalog: catalog});
          });
        });
      });
    });
  });
});

/* GET requirements */
router.get('/getRequirements', function(req, res, next) {
  var sql = "SELECT * FROM plan join planmajor on plan.planid = planmajor.planid WHERE plan.planid = ";
  sql += req.query.planid;
  db.query(sql, (err, rows) => {
  
    if(err){
      console.log("SELECT from plan join planmajor failed");
      console.log(err);
      return;
    }

    sql = "SELECT DISTINCT courseid, type FROM requirement WHERE ";
    for (let i =0; i < rows.length; i++) {
      sql += "major = '" + rows[i].major + "' OR ";
    }
    sql = sql.substring(0, sql.length - 3);
    sql += "ORDER BY CASE WHEN type = 'Core' THEN 1 WHEN type = 'Electives' THEN 2 WHEN type = 'Cognates' THEN 3 WHEN type = 'GenEds' THEN 4 END, courseid"
    db.query(sql, (err, rows) => {
    
      if(err){
        console.log("SELECT from requirement failed");
        console.log(err);
        return;
      }
      reqs = '';
      type = "";
      saw = [];
      for (let i =0; i < rows.length; i++) {
        if (rows[i].type != type) {
          if (type != "") {
            reqs = reqs.substring(0, reqs.length - 1);
            reqs += "]},";
          }
          type = rows[i].type;
          reqs += '"' + type + '":{"courses":[';
        }

        if (!(saw.includes(rows[i].courseid))) {
          saw.push(rows[i].courseid);
          reqs += '"' + rows[i].courseid + '",';
        }
      }
      reqs = reqs.substring(0, reqs.length - 1);

      res.render('getRequirements', {reqs: reqs});
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
    res.render('getPlanIds', {plans: rows});
  }); 
});


module.exports = router;

