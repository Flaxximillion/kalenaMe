var express = require('express');
var router = express.Router();
var exphbs = require("express-handlebars");
var app = express();

var usersCalendars = {
    userInCalendars:{
      cal1: {
        id: 'cal1',
        name: 'calendar1',
        description: 'This is calendar 1',
        isOwner: false
      },
      cal2: {
        id: 'cal2',
        name: 'calendar2',
        description: 'This is calendar 2',
        isOwner: true
      }
    },
    userInvites: {
      cal3: {
        id: 'cal3',
        name: 'calendar3',
        description: 'This is calendar 3'
      },
      cal4: {
        id: 'cal4',
        name: 'calendar4',
        description: 'This is calendar 4'
      }
    }
};

app.set("view engine", "handlebars");


router.get('/', function (req, res, next) {
    res.render('newCalendar.hbs', {cal: usersCalendars.userInCalendars, uncal: usersCalendars.userInvites});
});

module.exports = router;
