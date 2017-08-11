var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var models = require('../models');

var randomString = require('randomstring');

var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({extended: false});

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('createGroup.hbs');
});

router.post('/', jsonParser, function (req, res, next) {
    var calendarID = randomString.generate(7);
    models.Calendar.create({
        calendarID: calendarID,
        calendarName: req.body.calendarName,
        calendarDescription: req.body.calendarDescription,
        calendarOwner: req.body.calendarOwner
    });
    createNewCalendarUserTable(calendarID, req.body.calendarOwner);
});

function createNewCalendarUserTable(calendarID, owner) {
    var CalendarUserTable = models.db.sequelize.define('calendar' + calendarID + 'UserTable', {
        calendarUserUUID: {
            type: DataTypes.STRING,
            primaryKey: true,
            validate: {
                notNull: true,
                notEmpty: true
            }
        },
        calendarUserFirstName: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isAlphanumeric: true,
                notNull: true,
                notEmpty: true
            }
        },
        calendarUserLastName: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isAlphanumeric: true,
                notNull: true,
                notEmpty: true
            }
        },
        calendarUserPhone: {
            type: DataTypes.STRING,
            validate: {
                not: ["[a-z]", 'i'],
                notNull: true,
                notEmpty: true
            }
        },
        calendarUserEmail: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
                notNull: true,
                notEmpty: true
            }
        }
    }, {
        timestamps: false
    });

    CalendarUserTable.sync().then(function () {
        models.GlobalUser.findOne({
            where: {
                globalUserUUID: owner
            },
            raw: true
        }).then(function (response) {
            CalendarUserTable.create({
                calendarUserUUID: response.globalUserUUID,
                calendarUserFirstName: response.globalUserFirstName,
                calendarUserLastName: response.globalUserLastName,
                calendarUserPhone: response.globalUserPhone,
                calendarUserEmail: response.globalUserEmail
            });
        })
    });
}

module.exports = router;