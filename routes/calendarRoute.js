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
    .then(function(dbUser){
      res.json(dbUser);
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
    }).then(function(dbUser){
      res.json(dbUser)
    }).catch(function(){
      catchErr(err);
    });
  }
});


//create new calendar
router.post('/api/submit/', function(req, res, next){
  console.log(req.body);
    models.calendar.create(req.body)
    .then(function(dbUser){
      res.send("new calendar created and added to database");
      //redirect to newly created calendar
    }).catch(function(err){
      catchErr(err);
});

function catchErr(err){
  console.log("");
  console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
  console.log(err.errors);
}
module.exports = router;
