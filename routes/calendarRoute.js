var express = require('express');
var router = express.Router();
var models = require("../models");
var randomstring = require("randomstring");
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });


//get calendars
router.get('/api/:id', function(req, res, next){
  if (req.params.id === "all") {
    //return all users
    console.log("Find all calendars");
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
router.post('/api/calendar', jsonParser, function(req, res, next){

  var newCalendar = {};
  var rando = randomstring.generate(3);
  console.log("RANDO NUMBER: " + rando);
  var trimmedCalName = req.body.calendarName.trim();

  newCalendar.calendarID = trimmedCalName.replace(/\s/g,'') + "_" + rando;
  newCalendar.calendarName = trimmedCalName;
  newCalendar.calendarDescription = req.body.calendarDescription;
  newCalendar.calendarOwner = "";

  console.log("calendar .post actived!");
  console.log(newCalendar.calendarID);
  console.log(newCalendar.calendarName);
  console.log(newCalendar.calendarDescription);
  console.log(req.body.users);

  //popluate calendarUser table
  var newCalInfo = {};
  newCalInfo.calID = newCalendar.calendarID
  newCalInfo.users = req.body.users;

  findUserInfo(newCalInfo, function(result){
    newCalendar.calendarOwner = result;
    console.log("newCalendar.calendarOwner is " + result);
    createCal(newCalendar, function(y){
      console.log("createCal actived! " + newCalendar + " ////////// " + y);
      res.json(y);//TODO: needs an html pages to redirect to
    });
  });
});


//finds the users for a calendar from the globalUser table and pushes them to the calendarUser table
function findUserInfo(newCalInfo, cb){
  console.log("findUserInfo activated!");

  var userData = {};

  for (var i = 0; i < newCalInfo.users.length; i++) {
    console.log("loop: " + i);
    var obj = {};
    var query = {};
    query.globalUserFirstName = newCalInfo.users[i].firstName;
    query.globalUserLastName = newCalInfo.users[i].lastName;
    query.globalUserEmail = newCalInfo.users[i].email;
    console.log(query);

    models.globalUser.findOne({
      where: query,
      attributes: [globalUserUUID]
    }).then(function(result){
      console.log("returned UUID: " + result);
      userData.calendarUserUUID = result;
      if (i === 0) {
        cb(result);
      }
      userData.calendarID = newCalInfo.id;
      populateCalendarUser(userData, function(x){
        console.log("populateCalendarUser, x is: " + x);
      });
    }).catch(function(err){
      catchErr(err);
    });
  }
};


function populateCalendarUser(userData, cb){
  console.log("populateCalendarUser activated!!");
  models.calendarUser.create(userData)
  .then(function(result){
    cb(result);
  }).catch(function(err){
    catchErr(err);
  });
};


function createCal(newCalendar, y){
  models.calendar.create(newCalendar)
  .then(function(dbCal){
    console.log("new calendar created and added to database");
    y(dbCal);
  }).catch(function(err){
    catchErr(err);
  });
}


//displays error if one occurs
function catchErr(err){
  console.log("");
  console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
  console.log(err.errors);
}

router.post("/test", jsonParser, function(req, res){
  console.log("POST TEST!");
  console.log(req.body.test[0]);
  res.send("Hello there");
});

module.exports = router;
