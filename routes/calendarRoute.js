var express = require('express');
var router = express.Router();
var models = require("../models");
var randomstring = require("randomstring");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});

function loggedIn(req, res, next) {
    console.log(req.sessionID);
    req.session.reload(function () {
        if (req.session.uuid) {
            next();
        } else {
            res.redirect('/');
        }
    });
}

router.all('*', loggedIn, function (req, res, next) {
    next();
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    var calendar = {
        calendarName: req.body.calendarName,
        calendarDescription: req.body.calendarDescription,
        calendarOwner: req.session.uuid,
        calendarId: randomstring.generate(7)
    };
    models.calendar.create(calendar).then(function (res) {
        var calendarUsers = req.body.users.map(function (user) {
            var users = {
                calendarUserEmail: user,
                calendarID: res.dataValues.calendarId
            };
            return users;
        });
        calendarUsers.push({
            calendarUserEmail: req.session.email,
            calendarUserUUID: req.session.uuid,
            verified: true,
            isOwner: true,
            calendarID: res.dataValues.calendarId
        });
        models.calendarUser.bulkCreate(calendarUsers).then(function (userResult) {
            return models.calendarUser.findAll();
        }).then(function (returnUsers) {
            console.log(returnUsers);
        })
    })
});

router.post('/invite/:calendarID', function(req, res){
    models.calendarUser.create({
        calendarUserEmail: req.body.email,
        calendarID: req.body.calendarID
    }).then(function(invite){
        console.log(invite);
        res.send('addedInvite');
    })
});

router.get('/', function (req, res, next) {
    var cal = [];
    var uncal = [];
    models.calendarUser.findAll({
        include: [
            {
                model: models.calendar,
                as: 'calendars',
                attributes: {
                    exclude: ['calendarOwner']
                }
            }
        ],
        attributes: {
            include: ['isOwner', 'verified'],
            exclude: ['calendarUserUUID', 'calendarUserEmail', 'id', 'calendarID']
        },
        where: {
            calendarUserEmail: req.session.email
        },
        raw: true
    }).then(function (results) {
        for (var i = 0; i < results.length; i++) {
            if (results[i].verified) {
                cal.push({
                    isOwner: results[i].isOwner,
                    id: results[i]['calendars.calendarId'],
                    name: results[i]['calendars.calendarName'],
                    description: results[i]['calendars.calendarDescription']
                })
            } else {
                uncal.push({
                    id: results[i]['calendars.calendarId'],
                    name: results[i]['calendars.calendarName'],
                    description: results[i]['calendars.calendarDescription']
                })
            }
        }
        console.log(cal, uncal);
        res.render('newCalendar.hbs', {
            cal: cal,
            uncal: uncal
        });
    });
});

router.get('/join/:id', function (req, res, next) {
    console.log(req.params.id);
    models.calendarUser.findOne({
        where: {
            calendarID: req.params.id,
            calendarUserEmail: req.session.email
        },
        raw: true
    }).then(function (result) {
        console.log(result);
        if (!result.verified) {
            models.calendarUser.update({
                verified: true,
                calendarUserUUID: req.session.uuid
            }, {
                where: {
                    calendarID: req.params.id,
                    calendarUserEmail: req.session.email
                }
            });
        }
        next();
    });
});

router.get('/join/:calendarID', function (req, res, next) {
    models.calendar.findOne({
        where: {
            calendarId: req.params.calendarID
        },
        attributes: {
            exclude: ['calendarOwner']
        },
        raw: true
    }).then(function (result) {
        console.log("\n RESULTS:");
        console.log(result);

        models.calendarUser.findAll({
            where: {
                verified: true,
                calendarID: req.params.calendarID
            },
            attributes: {
                exclude: ['id', 'calendarUserEmail', 'calendarID', 'verified', 'isOwner']
            },
            raw: true
        }).then(function (calendarUsers) {
            var queryFor = calendarUsers.map(function (uuid) {
                return {uuid: uuid.calendarUserUUID};
            });

            models.sequelize.models.User.findAll({
                where: {
                    $or: queryFor
                },
                attributes: {
                    exclude: ['uuid', 'id', 'username', 'hash', 'salt', 'activationKey', 'resetPasswordKey', 'verified', 'createdAt', 'updatedAt']
                },
                raw: true
            }).then(function (users) {
                console.log(users);
                res.render("calendar.hbs", {
                    layout: "calendar.hbs",
                    meminfo: users,
                    calinfo: result
                });
            })
        });
    });
});


//displays error if one occurs
function catchErr(err) {
    console.log("");
    console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");

    console.log("\n sequelize error: \n" + err.SequelizeValidationError);
}

module.exports = router;
