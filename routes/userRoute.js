var express = require('express');
var router = express.Router();
var models = require("../models");
var randomstring = require("randomstring");
var bodyParser = require('body-parser');
var uuid = require('uuid/v4');
var bcrypt = require('bcryptjs');

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/api/:id', function (req, res, next) {
    if (req.params.id === "all") {
        //return all users
        models.globalUser.findAll({})
            .then(function (dbUser) {
                res.json(dbUser);
            }).catch(function (err) {
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
        }).then(function (dbUser) {
            res.json(dbUser)
        }).catch(function () {
            catchErr(err);
        });
    }
});

router.post('/login/', urlencodedParser, function(req, res, next){
    models.globalUser.findOne({
        where:{
            globalUserEmail: req.body.email
        },
        raw: true
    }).then(function(user){
        console.log(user);
        bcrypt.compare(req.body.password, user.globalUserHash).then(function(result){
            if(result){
                req.session.sessionid = "test"
            }
        })
    })
});


//creates new user
router.post('/submit/', urlencodedParser, function (req, res, next) {
    var userData = {
        globalUserUUID: uuid(),
        globalUserFirstName: req.body.firstName,
        globalUserLastName: req.body.lastName,
        globalUserPhone: req.body.phone,
        globalUserEmail: req.body.email
    };

    bcrypt.genSalt(10, function(err, salt){
        console.log(salt);
        bcrypt.hash(req.body.password, salt, function(err, hash){
            console.log(hash);
            userData.globalUserHash = hash;

            models.globalUser.create(userData)
                .then(function (dbUser) {
                    res.send("new user added to database");
                    //redirect to calendar list/create page
                }).catch(function (err) {
                catchErr(err);
            });
        })
    });
});


//displays error if one occurs
function catchErr(err) {
    console.log("");
    console.log("~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~ERROR~~~");
    console.log(err.Error);
}

module.exports = router;
