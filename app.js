
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var models = require('./models');
var passport = require('passport');
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var passportLocalSequelize = require('passport-local-sequelize');
var uuid = require('uuid/v4');


var UserDB = passportLocalSequelize.defineUser(models.sequelize, {
    firstName: models.Sequelize.STRING,
    lastName: models.Sequelize.STRING,
    uuid: models.Sequelize.STRING,
    email: models.Sequelize.STRING
}, {
    usernameField: "email"
});


var app = express();
// Socket.io
// https://github.com/onedesign/express-socketio-tutorial
var server = require('http').Server(app);
var io = require('socket.io')(server);

var index = require('./routes/index');
var calendarRoute = require('./routes/calendarRoute');
var messageRoute = require('./routes/messageRoute');
var taskRoute = require('./routes/taskRoute');


var Session = models.sequelize.define('Sessions', {
    sid: {
        type: models.Sequelize.STRING,
        primaryKey: true
    },
    email: models.Sequelize.STRING,
    userId: models.Sequelize.STRING,
    expires: models.Sequelize.DATE,
    data: models.Sequelize.STRING(50000)
});

function extendDefaultFields(defaults, session) {
    return {
        data: defaults.data,
        expires: defaults.expires,
        userId: session.uuid,
        email: session.email
    };
}

var store = new SequelizeStore({
    table: 'Sessions',
    extendDefaultFields: extendDefaultFields,
    db: models.sequelize
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'node_modules/socket.io-client/dist')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'super secret session key please do not do a leak',
    resave: false,
    saveUninitialized: false,
    store: store
}));


store.sync({
    force: true
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'express-handlebars');

app.use(passport.initialize());
passport.use(UserDB.createStrategy());
passport.serializeUser(UserDB.serializeUser());
passport.deserializeUser(UserDB.deserializeUser());

app.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user){
        if(err) return next(err);
        if(!user) return res.send(
            {
                valid: false
            });
        req.session.uuid = user.dataValues.uuid;
        req.session.email = user.dataValues.email;
        res.send(
            {
                valid: true,
                redirect:'/calendar'
            });
    })(req, res, next);
});

app.post('/create', function (req, res) {
    var newUser = {
        uuid: uuid(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.firstName + req.body.lastName
    };
    UserDB.register(newUser, req.body.password, function (err, result) {
        if(err) res.send({
            valid: false,
            redirect: '/'
        });
        req.session.uuid = result.dataValues.uuid;
        req.session.email = result.dataValues.email;
        res.send({
            valid: true,
            redirect: '/calendar'
        });
    });
});

app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/');
});

// Socket.io
// See https://github.com/onedesign/express-socketio-tutorial
app.use(function(req, res, next){
  res.io = io;
  next();
});

app.use('/', index);
app.use('/calendar', calendarRoute);
app.use('/task', taskRoute);
app.use('/messages', messageRoute);

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

module.exports = {app: app, server: server};
