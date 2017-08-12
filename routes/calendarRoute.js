var express = require('express');
var router = express.Router();
var models = require("../models");
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });


//get all calendars
router.get('/api/:id', function(req, res, next){
  if (req.params.id === "all") {
    //return all users
    models.calendar.findAll({})
    .then(function(dbCal){
      res.json(dbCal);
    }).catch(function(err){
      catchErr(err);
    });
  } else {
    //return specific user
    models.calendar.findOne({
      where: {
        calendarID: req.params.calendarID,
        calendarName: req.params.calendarName
      }
    }).then(function(dbCal){
      res.json(dbCal)
    }).catch(function(){
      catchErr(err);
    });
  }
});


//create new calendar
router.post('/api/calendar', function(req, res, next){
  console.log(req.body);
  var newCalendar = {};
  newCalendar.calendarName = req.body.calendarName;
  newCalendar.calendarDescription = req.body.calendarDescription;

  var calUsers = req.body.users;
  findUserInfo(calUsers, function(result){
    console.log(result);
  });

  models.calendar.create(newCalendar)
  .then(function(dbCal){
    console.log("new calendar created and added to database");
    res.send();
    //redirect to newly created calendar
  }).catch(function(err){
    catchErr(err);
});


//finds the users for a calendar from the globalUser table and pushes them to the calendarUser table
function findUserInfo(calUsers, cb){
  var userData = [];
  for (var i = 0; i < calUsers.length; i++) {
    models.globalUser.findOne({
      where: {
        globalUserFirstName: calUsers[i].firstName,
        globalUserLastName: calUsers[i].lastName,
        globalUserEmail: calUsers[i].email
      }
    }).then(function(result){
      userData.push(result);
    }).catch(function(err){
      catchErr(err);
    });
  }
  populateCalendarUser(userData, calData, cb);
};


function populateCalendarUser(userData, calData cb){
  var calUserData = {};

  for (var i = 0; i < userData.length; i++) {
    var obj = {
      calendarUserUUID: userData.globalUserUUID,
      calendarID:
    };
    calUserData.push(obj);
  }

  models.calendarUser.create(calUserData)
  .then(function(result){
    cb(result);
  }).catch(function(err){
    catchErr(err);
  });
};


//displays error if one occurs
function catchErr(err){
  console.log("");
  console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
  console.log(err.errors);
}

module.exports = router;
