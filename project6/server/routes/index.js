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

router.post('/savePlan', function(req, res, next) {
  planid = req.body.planid;
  add = req.body.add;
  del = req.body.del;

  for (let i =0; i < add.length; i++) {
    var sql = "INSERT INTO take values (";
    sql += '"' + add[i][0] + '", ';
    sql += '"' + add[i][1] + '", ';
    sql += '"' + add[i][2] + '", ';
    sql += '"' + add[i][3] + '"';
    sql += ")";
    db.query(sql, (err, rows) => {
      if(err){
        console.log("INSERT to take failed");
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ sucess: false }));
        return;
      }    
    });
  }

  for (let i =0; i < del.length; i++) {
    var sql = "DELETE FROM take WHERE ";
    sql += 'planid = "' + del[i][0] + '" AND ';
    sql += 'year = "' + del[i][1] + '" AND ';
    sql += 'term = "' + del[i][2] + '" AND ';
    sql += 'courseid = "' + del[i][3] + '"';
    db.query(sql, (err, rows) => {
      if(err){
        console.log("DELETE from take failed");
        console.log(err);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ sucess: false }));
        return;
      }    
    });
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: true }));
});

router.post('/saveNotes', function(req, res, next) {
  stuId = req.body.student.id;
  stuNote = req.body.student.note;
  facId = req.body.faculty.id;
  facNote = req.body.faculty.note;

  var sql = "SELECT note FROM note WHERE ownerId = ";
  sql += '"' + stuId + '"';
  
  db.query(sql, (err, rows) => {
    if(err){
      console.log("failed");
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ sucess: false }));
      return;
    }

    if (typeof rows[0] === 'undefined') {
      var sql = "INSERT INTO note VALUES (";
      sql += '"' + stuId + '", ';
      sql += '"' + stuId + '", ';
      sql += '"' + stuNote + '"';
      sql += ")";
      db.query(sql, (err, rows) => {
        if(err){
          console.log("failed");
          console.log(err);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ sucess: false }));
          return;
        }
      });
    } else {
      var sql = "UPDATE note SET note = ";
      sql += '"' + stuNote + '" WHERE ownerId = ';
      sql += '"' + stuId + '"';
      db.query(sql, (err, rows) => {
        if(err){
          console.log("failed");
          console.log(err);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ sucess: false }));
          return;
        }
      });
    }
  });


  var sql = "SELECT note FROM note WHERE ownerId = ";
  sql += '"' + facId + '" AND studentId = ';
  sql += '"' + stuId + '"';
  
  db.query(sql, (err, rows) => {
    if(err){
      console.log("failed");
      console.log(err);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ sucess: false }));
      return;
    }

    if (typeof rows[0] === 'undefined') {
      var sql = "INSERT INTO note VALUES (";
      sql += '"' + stuId + '", ';
      sql += '"' + facId + '", ';
      sql += '"' + facNote + '"';
      sql += ")";
      db.query(sql, (err, rows) => {
        if(err){
          console.log("failed");
          console.log(err);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ sucess: false }));
          return;
        }
      });
    } else {
      var sql = "UPDATE note SET note = ";
      sql += '"' + facNote + '" WHERE ownerId = ';
      sql += '"' + facId + '" AND studentId = ';
      sql += '"' + stuId + '"';
      db.query(sql, (err, rows) => {
        if(err){
          console.log("failed");
          console.log(err);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ sucess: false }));
          return;
        }
      });
    }
  });


  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ success: true }));
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

/*
router.get('/getUser', function(req, res, next) {
  var sql = "SELECT * from user where userid = ";
  sql += req.query.user;
  db.query(sql, (err, rows) => {
  
    if(err){
      console.log("SELECT from user failed");
      console.log(err);
      return;
    }
    console.log(user);
    res.render('getUser', {users: rows});
  }); 
});*/

router.get('/getUser', function(req, res, next) {
  var sql = "SELECT * from user where username = '";
  sql += req.query.id;
  sql +="'"
  db.query(sql, (err, rows) => {
  
    if(err){
      console.log("SELECT from plan failed");
      console.log(err);
      return;
    }
    res.render('getUser', {plans: rows});
  }); 
});

router.get('/getStudents', function(req, res, next) {
  var sql = "SELECT * from user where roleid=3";

  db.query(sql, (err, rows) => {
  
    if(err){
      console.log("SELECT from user failed");
      console.log(err);
      return;
    }
    
    
    let users = "{";
    for(let i = 0; i < rows.length; i++){
      users += '"' + rows[i].userid + '": "' + rows[i].name + '", ';  
    }

    users = users.substring(0, users.length - 2);
    users += "}";

    res.setHeader('Content-Type', 'application/json');
    res.end(users);
  }); 

});


module.exports = router;

