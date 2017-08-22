var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var models = require("../models");
var users = [];
var connections = [];
var calendarID;
router.get('/api/:calID', function (req, res, next) {
    calendarID = req.params.calID; //uncommented so info can be used for router.post
    // res.render('chatRoom.hbs', {title: 'Kalena'});
    res.render('chatRoom.hbs');
});
router.post('/message', function (req, res, next) {
  console.log("\n" + req.body);
  console.log("\n" + req.session.uuid);
  models.sequelize.models.User.findOne({
    where: {
      uuid: req.session.uuid
    }
  })
  .then(function(data){
    console.log("\ndata: " + JSON.stringify(data));
    var squack = {};
    squack.messageCalendar = calendarID;
    squack.userUUID = req.session.uuid;
    squack.messageText = req.body.messageText;
    squack.userName = data.username;
    models.messages.create(squack)
    .then(function(result){
      res.io.emit('refreshMessages', 'Ahoy, there! New messages availale');
    });
  });
});
router.get('/', function(req, res, next){
  models.messages.findAll({
    where: {
      messageCalendar: calendarID
    }
  })
  .then(function(result){
    res.send(result);
  });
});
// router.get('/logoff', function(req, res){
//   models.messages.destroy({
//     where:{
//       userUUID: req.session.uuid
//     }
//   })
//   .then(function(result){
//     grabUsers();
//     res.redirect('/');
//   });
// });
// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });
// io.sockets.on('connection', function(socket){
//
//   connections.push(socket);
//   console.log('Connected: %s sockets connected', connections.length);
//
//   //Disconnect
//   socket.on('disconnect', function(data){
//     // users.splice(users.indexOf(socket.username), 1);
//     // updateUsernames();
//     // connections.splice(connections.indexOf(socket), 1);
//     // console.log('Disconnected: %s sockets connected', connections.length);
//
//   });
//
//   //Send Message
//   socket.on('send message', function(data){
//     io.sockets.emit('new message', {msg: data, user: socket.username});
//   });
//
//   socket.on('new user', function(data, callback){
//     console.log("new user!!! " + data);
//     callback(true);
//     updateUsernames();
//   });
//
//   function updateUsernames(){
//     // var currentUserID = req.session.uuid;
//     // models.sequelize.models.User.findOne({
//     //   where: {
//     //     uuid: currentUserID
//     //   },
//     //   attributes: {
//     //     exlude: ['lastName', 'uuid', 'email', 'id', 'username', 'hash', 'salt', 'activationKey', 'resetPasswordKey', 'verified', 'createdAt', 'updatedAt']
//     //   },
//     //   raw: true
//     // })
//     // .then(function(name){
//     //   users.push(name);
//     // });
//
//     //HERE WE SHOULD HAVE A FUNCTION THAT
//     //GRABES THE USERS IN THE CALENDAR AND
//     //PUSHES THE USERS TO THE var users = [];
//     // console.log("update users");
//     // io.sockets.emit('get users', users);
//   }
//
//   function grabUsers(){
//     models.messages.findAll({
//       where: {
//         messageCalendar: calendarID
//       }
//     })
//     .then(function(result){
//       socket.emit('get users', result);
//     });
//   }
//
//   socket.on('loggedin', function(data){
//     var currentUserID = req.session.uuid;
//
//     models.sequelize.models.User.findOne({
//       where: {
//         uuid: currentUserID
//       },
//       attributes: {
//         exlude: ['lastName', 'uuid', 'email', 'id', 'username', 'hash', 'salt', 'activationKey', 'resetPasswordKey', 'verified', 'createdAt', 'updatedAt']
//       },
//       raw: true
//     })
//     .then(function(fn){
//       var info = {};
//       info.userUUID = currentUserID;
//       info.firstName = fn;
//       info.messageCalendar = calendarID;
//       models.messages.create(info)
//       .then(function(result){
//         grabUsers();
//       });
//     });
//   });
// });
module.exports = router;
