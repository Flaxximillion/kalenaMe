var express = require('express');
var router = express.Router();
var models = require("../models");
var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// router.get('/:id', function(req, res, next){
//     res.send('test');
// });

//get all users from db
router.get('/all', function(req, res, next){
    models.globalUser.findAll({}).then(function(dbUser){
      res.json(dbUser);
    });
});

//creates new user
router.post('/submit/',urlencodedParser, function(req, res, next){
  console.log(req.body);
    models.globalUser.create(req.body).then(function(dbUser){
      res.send("new user added to database");
    }).catch(function(err){
      console.log("");
      console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
      console.log(err.errors);
    });
});

module.exports = router;
