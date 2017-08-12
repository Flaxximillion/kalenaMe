var express = require('express');
var router = express.Router();
var models = require("../models");
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/api/:id', function(req, res, next){
    if (req.params.id === "all") {
      //return all users
      models.globalUser.findAll({})
      .then(function(dbUser){
        res.json(dbUser);
      }).catch(function(err){
        catchErr(err);
      });
    } else {
      //return specific user
      models.globalUser.findOne({
        where: {
          globalUserFirstName: req.params.firstName,
          globalUserLastName: req.params.lastName,
          globalUserPassword: req.params.password
        }
      }).then(function(dbUser){
        res.json(dbUser)
      }).catch(function(){
        catchErr(err);
      });
    }
});

//get all users from db
// router.get('/all', function(req, res, next){
//     models.globalUser.findAll({}).then(function(dbUser){
//       res.json(dbUser);
//     });
// });


//creates new user
router.post('/submit/',urlencodedParser, function(req, res, next){
  console.log(req.body);
    models.globalUser.create(req.body)
    .then(function(dbUser){
      res.send("new user added to database");
      //redirect to calendar list/create page
    }).catch(function(err){
      catchErr(err);
    });
});


//displays error if one occurs
function catchErr(err){
  console.log("");
  console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
  console.log(err.errors);
}

module.exports = router;
