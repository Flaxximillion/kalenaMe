var express = require('express');
var router = express.Router();
var models = require("../models");
var randomstring = require("randomstring");
var bodyParser = require('body-parser');

var randomString = require('randomstring');

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({extended: false});

// router.get('/:id', function (req, res, next) {
//     console.log(req.params.id);
//     res.send('test');
// });
//
// router.post('/submit/', urlencodedParser, function (req, res, next) {
//     var string = randomString.generate(7);
//     var newCalendar = models.calendar.create({
//         calendarid: string,
//         calendarname: req.body.calendarName,
//         calendardescription: req.body.calendarDescription,
//         calendarowner: req.body.user
//     });
//     res.send('test');
// });


//get all calendars
router.get('/api/:id', function (req, res, next) {
    if (req.params.id === "all") {
        //return all users
        models.calendar.findAll({})
            .then(function (dbUser) {
                res.json(dbUser);
            }).catch(function (err) {
            catchErr(err);
        });
    } else {
        //return specific user
        models.calendar.findOne({
            where: {
                calendarID: req.params.calendarID,
                calendarName: req.params.calendarName
            }
        }).then(function (dbUser) {
            res.json(dbUser)
        }).catch(function () {
            catchErr(err);
        });
    }
});

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
router.post('/api/submit/', function (req, res, next) {
    console.log(req.body);
    models.calendar.create(req.body)
    .then(function(dbUser){
      res.send("new calendar created and added to database");
      //redirect to newly created calendar
    }).catch(function(err){
      catchErr(err);
    });
});

function catchErr(err) {
    console.log("");
    console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
    console.log(err.errors);
}
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
  newCalInfo.calID = newCalendar.calendarID;
  newCalInfo.users = req.body.users;

  var numberOfLoops = newCalInfo.users.length;
  controlQuery(newCalInfo, createCal, numberOfLoops, 0, function(data){
    res.send(data);
  });

});//--router.post--



function controlQuery(newCalInfo, fnToCallWhenDone, numberOfLoops, zero, dbResponse){
  console.log("controlQuery activated!");

  if (numberOfLoops === 0) {
    return fnToCallWhenDone(newCalendar, function(cb){
      dbResponse(cb);
    });
  }
  findUserInfo(newCalInfo, zero, function whenDone(result){
    console.log("whenDone activated!!! " + result);
    if (zero === 0) {
      newCalendar.calendarOwner = result.globalUserUUID;
    }
    controlQuery(newCalInfo, fnToCallWhenDone, numberOfLoops - 1, zero ++);
  });
}//--controlQuery--



function findUserInfo(newCalInfo, zero, cb){
  console.log("findUserInfo activated: " + zero);
  var calData = {};
  var query = {};
  query.globalUserFirstName = newCalInfo.users[zero].firstName;
  query.globalUserLastName = newCalInfo.users[zero].lastName;
  query.globalUserEmail = newCalInfo.users[zero].email;

  models.globalUser.findOne({
    where: query
  })
  .then(function(result){
    console.log("!!!!!!!!!!!!");
    cb(result);
    calData.calendarUserUUID = result.globalUserUUID;
    calData.calendarID = newCalInfo.calID;
    console.log(calData.globalUserUUID);
    console.log(calData.calendarID);
    populateCalendarUser(calData);
  })
  .catch(function(err){
    catchErr(err);
  });
}//--findUserInfo--



function populateCalendarUser(calData){
  console.log("populateCalendarUser activated!!");
  models.calendarUser.create(calData)
  .then(function(result){
    console.log("Calendar ID and corresponding User have been added to database");
  }).catch(function(err){
    catchErr(err);
  });
}


function createCal(newCalendar, cb){
  console.log("createCal activated!!!!");
  models.calendar.create(newCalendar)
  .then(function(dbCal){
    console.log("new calendar created and added to database");
    cb(dbCal);
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
