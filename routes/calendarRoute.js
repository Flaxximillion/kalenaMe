//===================[variables]===================
var express = require('express');
var router = express.Router();
var models = require("../models");
var randomstring = require("randomstring");
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});


router.get('/', loggedIn, function (req, res, next) {
    next();
});

router.get('/', function(req, res, next){
    models.calendarUser.findAll({
        where: {
            calendarUserEmail: req.session.email
        },
        raw: true
    }).then(function(results){
        console.log(results);
    });
    res.render('newCalendar.hbs', calendarData);
});

// router.get('/join/:calendarID', function(req, res, next){
//     models.calendarUser.findOne({
//         where:{
//             calendarID: req.param.calendarID,
//             calendarUserEmail: req.session.email
//         },
//         raw: true
//     }).then(function(result){
//         if(!result.verified){
//             models.calendarUser.update({
//                 verified: true,
//                 calendarUserUUID: req.session.uuid
//             },{
//                 where: {
//                     calendarID: req.param.calendarID,
//                     calendarUserEmail: req.session.email
//                 }
//             });
//         }
//         next();
//     });
// });

router.get('/join/:calendarID', function(req, res, next){
    var calendarInfo = {};
    console.log(req.params);
    models.calendar.findOne({
        where:{
            calendarId: req.params.calendarID
        },
        attributes: ['calendarName', 'calendarDescription'],
        raw: true
    }).then(function(res){
        calendarInfo.calendarData = res;
    });

    models.Users.findAll({
        include: [{
            model: models.calendarUser,
            where: {
                calendarId: req.params.calendarID
            }
        }],
        raw: true,
        attributes: ['email', 'firstName', 'lastName']
    }).then(function(calendarUsers){
        console.log(calendarUsers);
    })
});

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

var resultCounter = 0;

//===================[function]===================

// var newCalForCalTable = function (calTableOnly, cb) {
//     console.log("\n newCalForCalTable activated!");
//     models.calendar.create(calTableOnly)
//         .then(function (result) {
//             console.log(" \n new calendar info inserted into database");
//             cb(result);
//         })
//         .catch(function (err) {
//             catchErr(err);
//         });
// };//--newCalForCalTable--
//
//
// var queryDBforOwner = function (newCalInfo, cb) {
//     console.log("\n queryDBforOwner activated!");
//     var query = {};
//     query.globalUserEmail = newCalInfo.memberEmails[0];
//
//     models.globalUser.findOne({
//         where: query
//     })
//         .then(function (result) {
//             console.log("\n globalUserUUID: " + result.dataValues.globalUserUUID);
//             cb(result);
//         })
//         .catch(function (err) {
//             catchErr(err);
//         });
// };//--queryDBforUUID--
//
//
// var updateCalTable = function (calTableOnly, cb) {
//     console.log("\n updateCalTable activated!");
//     models.calendar.update({
//         calendarOwner: calTableOnly.calendarOwner
//     }, {
//         where: {
//             id: calTableOnly.calendarID
//         }
//     })
//         .then(function (result) {
//             console.log("\n calendar table info fully updated!");
//             cb(result);
//         })
//         .catch(function (err) {
//             catchErr(err);
//         });
// };//--updateCalTable--
//
//
// var inputInfoIntoCalUserTable = function (newCalInfo, cb) {
//     console.log("\n inputInfoIntoCalUserTable activated!");
//
//     var input = [];
//     for (var i = 0; i < newCalInfo.memberEmails.length; i++) {
//         var obj = {};
//         obj.calendarUserEmail = newCalInfo.memberEmails[i];
//         obj.calendarID = newCalInfo.calendarID;
//         console.log(i + " " + obj.calendarUserEmail + " " + obj.calendarID);
//         input.push(obj);
//     }
//
//     models.calendarUser.bulkCreate(input)
//         .then(function (result) {
//             console.log("\n initial info for calendarUser table inserted");
//             cb(result);
//         })
//         .catch(function (err) {
//             catchErr(err);
//         });
// };//--inputInfoIntoCalUserTable--
//
//
// var queryDBforUsers = function (newCalInfo, loops, i, cb) {
//     console.log("\n queryDBforUsers activated!");
//
//     var query = [];
//     for (var i = 0; i < newCalInfo.memberEmails.length; i++) {
//         var obj = {};
//         obj.globalUserEmail = newCalInfo.memberEmails[i];
//         query.push(obj);
//     }
//
//     models.globalUser.findAll({
//         where: {
//             $or: query
//         }
//     })
//         .then(function (result) {
//             console.log("\n result! " + result[0].globalUserUUID);
//             var passback = [];
//             for (var i = 0; i < result.length; i++) {
//                 var obj = {};
//                 obj.globalUserUUID = result[i].globalUserUUID;
//                 obj.globalUserEmail = result[i].globalUserEmail;
//                 passback.push(obj);
//             }
//             console.log(passback);
//             cb(passback);
//         })
//         .catch(function (err) {
//             catchErr(err);
//         });
// };//--queryDBforUsers--
//
//
// var updateCalUserTable = function (passback, cb) {
//     console.log("\n updateCalUserTable activated!");
//
//     for (var i = 0; i < passback.length; i++) {
//         models.calendarUser.update({
//             calendarUserUUID: passback[i].globalUserUUID,
//             verified: true,
//         }, {
//             where: {
//                 calendarUserEmail: passback[i].globalUserEmail
//             }
//         })
//             .then(function (result) {
//                 cb(result);
//             })
//             .catch(function (err) {
//                 console.log(i + " ERROR LOOP!");
//                 catchErr(err);
//             });
//     }
//
// };//--updateCalUserTable--
//
//
// //===================[GET/POST]===================
//
// //get all calendars
// router.get('/api/:id', function (req, res, next) {
//     if (req.params.id === "all") {
//         //return all users
//         models.calendar.findAll({})
//             .then(function (dbUser) {
//                 res.json(dbUser);
//             }).catch(function (err) {
//             catchErr(err);
//         });
//     } else {
//         //return specific user
//         models.calendar.findOne({
//             where: {
//                 calendarID: req.params.calendarID,
//                 calendarName: req.params.calendarName
//             }
//         }).then(function (dbUser) {
//             res.json(dbUser)
//         }).catch(function () {
//             catchErr(err);
//         });
//     }
// });
// //create new calendar
//
// router.post('/', jsonParser, function(req, res, next){
//     console.log(req.body);
//     var calendarInfo = {
//         calendarName: req.body.calendarName,
//         calendarDescription: req.body.calendarDescription,
//         calendarOwner: req.session.uuid,
//         calendarId: randomstring.generate(7)
//     };
//     models.calendar.create(calendarInfo).then(function(result){
//         console.log(result);
//         var bulkCreate = [];
//         for(var i = 0; i < req.body.users.length; i++){
//             var user = {
//                 calendarUserEmail: req.body.users[i],
//                 calendarID: result.dataValues.calendarId
//             };
//             bulkCreate.push(user);
//         }
//         models.calendarUser.bulkCreate(bulkCreate).then(function(createdUsers){
//             console.log(createdUsers);
//         })
//     })
// });
//
// router.post('/api/calendar', jsonParser, function (req, res, next) {
//     console.log("\n router.post calendar/api/calendar heard!");
//     var newCalInfo = req.body;
//     console.log(newCalInfo);
//
//     var calTableOnly = {};
//     calTableOnly.calendarName = newCalInfo.calendarName;
//     calTableOnly.calendarDescription = newCalInfo.calendarDescription;
//     calTableOnly.calendarOwner = req.session.uuid;
//     console.log(calTableOnly);
//
//     newCalForCalTable(calTableOnly, function (result) {
//         console.log("\n result from callback (newCalForCalTable): \n" + result);
//         console.log(result.get("id"));
//         newCalInfo.calendarID = result.get("id");
//         console.log("\n calendar ID: " + newCalInfo.calendarID);
//         calTableOnly.calendarID = result.get("id");
//
//         queryDBforOwner(newCalInfo, function (result) {
//             calTableOnly.calendarOwner = result.dataValues.globalUserUUID;
//
//             updateCalTable(calTableOnly, function (result) {
//                 console.log("\n!! " + result);
//
//                 inputInfoIntoCalUserTable(newCalInfo, function (result) {
//                     console.log("\n!!!! " + result);
//
//                     var loops = newCalInfo.memberEmails.length;
//                     queryDBforUsers(newCalInfo, loops, 0, function (passback) {
//                         for (var i = 0; i < passback.length; i++) {
//                             console.log("\n!!!!!! " + passback[i].globalUserUUID);
//                             console.log("!!!!!! " + passback[i].globalUserEmail);
//                         }
//
//                         updateCalUserTable(passback, function (result) {
//                             resultCounter++;
//                             console.log("\n resultCounter: " + resultCounter);
//                             if (resultCounter === passback.length) {
//                                 console.log("calendarUser table updated!");
//                                 res.send(result);
//                             }
//                         });
//                     });
//                 });
//             });
//         });
//     });
//
//
//     //res.send("I heard ya!")
// });//--router.post--
//
//
// //displays error if one occurs
// function catchErr(err) {
//     console.log("");
//     console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
//     console.log(err);
//     console.log("\n sequelize error: \n" + err.SequelizeValidationError);
// }
//

module.exports = router;
