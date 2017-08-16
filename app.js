var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var models = require('./models');
var passport = require('passport');
var passportLocalSequelize = require('passport-local-sequelize');

var UserDB = passportLocalSequelize.defineUser(models.sequelize, {
    firstName: models.Sequelize.STRING,
    lastName: models.Sequelize.STRING,
    email: models.Sequelize.STRING
});

var index = require('./routes/index');
var userRoute = require('./routes/userRoute');
var calendarRoute = require('./routes/calendarRoute');
var messageRoute = require('./routes/messageRoute');
var taskRoute = require('./routes/taskRoute');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'express-handlebars');

app.use(passport.initialize());
app.use(passport.session());
passport.use(UserDB.createStrategy());
passport.serializeUser(UserDB.serializeUser());
passport.deserializeUser(UserDB.deserializeUser());

app.post('/login', passport.authenticate('local'), function(req, res){
    res.send('logged in');
});

app.post('/create', function(req, res){
    var newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username
    };
    UserDB.register(newUser, req.body.password, function(err, result){
        console.log(err, res);
        res.send(result);
    });
});

app.get('/logout', function(req, res){
    req.logout();
    res.send('loggedout');
});

app.use('/', index);
app.use('/calendar', calendarRoute);
app.use('/user', userRoute);
app.use('/task', taskRoute);
app.use('/message', messageRoute);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error.hbs');
});

module.exports = app;
