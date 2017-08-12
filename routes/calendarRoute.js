var express = require('express');
var router = express.Router();
var models = require("../models");
var bodyParser = require('body-parser');
var randomString = require('randomstring');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/:id', function(req, res, next){
    console.log(req.params.id);
    res.send('test');
});

router.post('/submit/', urlencodedParser, function(req, res, next){
    var string = randomString.generate(7);
    var newCalendar = models.calendar.create({
        calendarid: string,
        calendarname: req.body.calendarName,
        calendardescription: req.body.calendarDescription,
        calendarowner: req.body.user
    });
    res.send('test');
});

module.exports = router;