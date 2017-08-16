var express = require('express');
var router = express.Router();
var models = require("../models");
var randomstring = require("randomstring");
var bodyParser = require('body-parser');

var randomString = require('randomstring');

var jsonParser = bodyParser.json();

var urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/', function(req, res){
    console.log(req.session);
    res.render('newCalendar.hbs');
});


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


router.post('/api/calendar', jsonParser, function(req, res, next){

  var newCalendar = {};
  var rando = randomstring.generate(3);
  console.log("RANDO NUMBER: " + rando);
  var trimmedCalName = req.body.calendarName.trim();

  newCalendar.calendarID = trimmedCalName.replace(/\s/g,'') + "_" + rando;
  newCalendar.calendarName = trimmedCalName;
  newCalendar.calendarDescription = req.body.calendarDescription;
  newCalendar.calendarOwner = "";

  //popluate calendarUser table
  var newCalInfo = {};
  newCalInfo.calID = newCalendar.calendarID;
  newCalInfo.memberEmails = req.body.memberEmails;// make changes so  this matches new input style from html (calendar memeber emails only)

  var numberOfLoops = newCalInfo.memberEmails.length;

  //======console log checks==============
  console.log("number of loops: " + numberOfLoops);
  console.log("newCalendar: " + newCalendar);
  console.log("newCalInfo" + newCalInfo);
  //======================================
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
      newCalendar.calendarOwner = result.globalUserUUID;//TODO where is the info used?
    }
    controlQuery(newCalInfo, fnToCallWhenDone, numberOfLoops - 1, zero ++);
  });
}//--controlQuery--



function findUserInfo(newCalInfo, zero, cb){
  console.log("findUserInfo activated. loop: " + zero);
  var calData = {};
  calData.calendarID = newCalInfo.calID;
  calData.memberEmail = newCalInfo.memberEmails[zero];
  var query = {};
  query.globalUserEmail = newCalInfo.memberEmails[zero];
  models.globalUser.findOne({
    where: query
  })
  .then(function(result){
    console.log("");
    console.log(result.dataValues);
    console.log("findUserInfo database query complete");

    if (result) {
      console.log("result TRUE " + result);
      cb(result);
      calData.verified = true;
      calData.calendarUserUUID = result.globalUserUUID;
      populateCalendarUser(calData);
    } else {
      console.log("result FALSE " + result);
      populateCalendarUser(calData);
    }

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
    catchErr(err.Error);
  });
}


//displays error if one occurs
function catchErr(err){
  console.log("");
  console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
  console.log(err.Error);
}



module.exports = router;
