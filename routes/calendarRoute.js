var express = require('express');
var router = express.Router();
var models = require("../models");
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


//create new calendar
router.post('/api/submit/', function (req, res, next) {
    console.log(req.body);
    models.calendar.create(req.body)
        .then(function (dbUser) {
            res.send("new calendar created and added to database");
            //redirect to newly created calendar
        }).catch(function (err) {
        catchErr(err);
    })
});

function catchErr(err) {
    console.log("");
    console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
    console.log(err.errors);
}

module.exports = router;
