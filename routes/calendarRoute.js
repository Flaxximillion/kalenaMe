//===================[variables]===================
var express = require('express');
var router = express.Router();
var models = require("../models");
var randomstring = require("randomstring");
var bodyParser = require('body-parser');
var randomString = require('randomstring');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});

var resultCouter = 0;

//===================[function]===================

var newCalForCalTable = function(calTableOnly, cb){
  console.log("\n newCalForCalTable activated!");
  models.calendar.create(calTableOnly)
  .then(function(result){
    console.log(" \n new calendar info inserted into database");
    cb(result);
  })
  .catch(function(err){
    catchErr(err);
  });
};//--newCalForCalTable--




var queryDBforOwner = function(newCalInfo, cb){
  console.log("\n queryDBforOwner activated!");
  var query = {};
  query.globalUserEmail = newCalInfo.memberEmails[0];

  models.globalUser.findOne({
    where: query
  })
  .then(function(result){
    console.log("\n globalUserUUID: " + result.dataValues.globalUserUUID);
    cb(result);
  })
  .catch(function(err){
    catchErr(err);
  });
};//--queryDBforUUID--




var updateCalTable = function(calTableOnly, cb){
  console.log("\n updateCalTable activated!");
  models.calendar.update({
    calendarOwner: calTableOnly.calendarOwner
  }, {
    where: {
      id: calTableOnly.calendarID
    }
  })
  .then(function(result){
    console.log("\n calendar table info fully updated!");
    cb(result);
  })
  .catch(function(err){
    catchErr(err);
  });
};//--updateCalTable--




var inputInfoIntoCalUserTable = function(newCalInfo, cb){
  console.log("\n inputInfoIntoCalUserTable activated!");

  var input = [];
  for (var i = 0; i < newCalInfo.memberEmails.length; i++) {
    var obj = {};
    obj.calendarUserEmail = newCalInfo.memberEmails[i];
    obj.calendarID = newCalInfo.calendarID;
    console.log(i + " " + obj.calendarUserEmail + " " + obj.calendarID);
    input.push(obj);
  }

  models.calendarUser.bulkCreate(input)
  .then(function(result){
    console.log("\n initial info for calendarUser table inserted");
    cb(result);
  })
  .catch(function(err){
    catchErr(err);
  });
};//--inputInfoIntoCalUserTable--




var queryDBforUsers = function(newCalInfo, loops, i, cb){
  console.log("\n queryDBforUsers activated!");

  var query = [];
  for (var i = 0; i < newCalInfo.memberEmails.length; i++) {
    var obj = {};
    obj.globalUserEmail = newCalInfo.memberEmails[i];
    query.push(obj);
  }

  models.globalUser.findAll({
    where: {
      $or: query
    }
  })
  .then(function(result){
    console.log("\n result! " + result[0].globalUserUUID);
    var passback = [];
    for (var i = 0; i < result.length; i++) {
      var obj = {};
      obj.globalUserUUID = result[i].globalUserUUID;
      obj.globalUserEmail = result[i].globalUserEmail;
      passback.push(obj);
    }
    console.log(passback);
    cb(passback);
  })
  .catch(function(err){
    catchErr(err);
  });
};//--queryDBforUsers--




var updateCalUserTable = function(passback, cb){
  console.log("\n updateCalUserTable activated!");

  for (var i = 0; i < passback.length; i++) {
    models.calendarUser.update({
      calendarUserUUID: passback[i].globalUserUUID,
      verified: true,
    },{
      where: {
        calendarUserEmail: passback[i].globalUserEmail
      }
    })
    .then(function(result){
      cb(result);
    })
    .catch(function(err){
      console.log(i + " ERROR LOOP!");
      catchErr(err);
    });
  }

};//--updateCalUserTable--


//===================[GET/POST]===================

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
router.post('/api/calendar', jsonParser, function(req, res, next){
  console.log("\n router.post calendar/api/calendar heard!");
  var newCalInfo = req.body;
  console.log(newCalInfo);

  var calTableOnly = {};
  calTableOnly.calendarName = newCalInfo.calendarName;
  calTableOnly.calendarDescription = newCalInfo.calendarDescription;
  calTableOnly.calendarOwner = "";
  console.log(calTableOnly);

  newCalForCalTable(calTableOnly, function(result){
    console.log("\n result from callback (newCalForCalTable): \n" + result);
    console.log(result.get("id"));
    newCalInfo.calendarID = result.get("id");
    console.log("\n calendar ID: " + newCalInfo.calendarID);
    calTableOnly.calendarID = result.get("id");

    queryDBforOwner(newCalInfo, function(result){
      calTableOnly.calendarOwner = result.dataValues.globalUserUUID;

      updateCalTable(calTableOnly, function(result){
        console.log("\n!! " + result);

        inputInfoIntoCalUserTable(newCalInfo, function(result){
          console.log("\n!!!! " + result);

          var loops = newCalInfo.memberEmails.length;
          queryDBforUsers(newCalInfo, loops, 0, function(passback){
            for (var i = 0; i < passback.length; i++) {
              console.log("\n!!!!!! " + passback[i].globalUserUUID);
              console.log("!!!!!! " + passback[i].globalUserEmail);
            }

            updateCalUserTable(passback, function(result){
              resultCouter++;
              console.log("\n resultCouter: " + resultCouter);
              if (resultCouter === passback.length) {
                console.log("calendarUser table updated!");
                res.send(result);
              }
            });
          });
        });
      });
    });
  });


  //res.send("I heard ya!")
});//--router.post--






//displays error if one occurs
function catchErr(err){
  console.log("");
  console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
  console.log(err);
  console.log("\n sequelize error: \n" + err.SequelizeValidationError);
}



module.exports = router;
