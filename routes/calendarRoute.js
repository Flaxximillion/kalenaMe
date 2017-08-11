var express = require('express');
var router = express.Router();
var db = require("../models");

//test GET route
router.get('/api/test/calendar', function (req, res) {
  db.Calendar.findAll({}).then(function(dbCalendar){
    //res.json(dbCalendar);
    res.send("Hello World");
  });
});

//GET route for retrieving all the calendars
router.get('/api/calendar', function (req, res) {
  db.Calendar.findAll({}).then(function(dbCalendar){
    res.json(dbCalendar);
  });
});

//POST route for creating a new calendar
router.post("/api/calendar" function(req, res){
  db.Calendar.create(req.body)
  .then(function(dbCalendar){
    res.json(dbCalendar);
  });
});

module.exports = router;
