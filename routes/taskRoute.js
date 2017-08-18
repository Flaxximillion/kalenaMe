var models = require("../models");
var express = require('express');
var router = express.Router();

router.get("/:calendarID", function (req, res, next) {
    models.tasks.findAll({
        where: {
            taskCalendar: req.params.calendarID
        },
        include: [{
            model: models.sequelize.models.User,
            as: 'userRequester',
            attributes: {
                exclude: ['id', 'createdAt', 'updatedAt', 'hash', 'salt', 'activationKey', 'resetPasswordKey', 'verified', 'username']
            }
        },{
            model: models.sequelize.models.User,
            as: 'userAccepter',
            attributes: {
                exclude: ['id', 'createdAt', 'updatedAt', 'hash', 'salt', 'activationKey', 'resetPasswordKey', 'verified', 'username']
            }
        }],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    }).then(function (data) {
        console.log(data);
        var tasks = {
            events: [],
            className: "task" // adds class to all events
        };
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].dataValues.userRequester);
            // Create data objects according to format that FullCalendar.io expects

            var vals = {
                "title": data[i].dataValues.taskName,
                "start": data[i].dataValues.taskDate,
                "claimed": data[i].dataValues.taskAccepted,
                "description": data[i].dataValues.taskDescription,
                "className": data[i].dataValues.taskAccepted ? "claimed" : "unclaimed",
                "claimedBy": data[i].dataValues.taskAccepter,
                "id": data[i].dataValues.id,
                "taskCreator": data[i].dataValues.userRequester.firstName + " " + data[i].dataValues.userRequester.lastName,

            };

            if(data[i].dataValues.userAccepter === null){
              vals["claimUser"] = "";
            } else {
              vals["claimUser"] = data[i].dataValues.userAccepter.firstName + " " + data[i].dataValues.userAccepter.lastName;
            }
            tasks.events.push(vals);
        }
        res.json(tasks);
    })
        .catch(function (err) {
            console.log(err);
        });
});

router.post('/update/:id', function (req, res) {
  console.log(req.body);

    req.body.taskAccepter = req.session.uuid;
    models.tasks.update(
        req.body,
        {
            where: {id: req.params.id}
        }
    )
        .then(function (data) {
            res.send("DONE.");
        });
});


router.post('/new', function (req, res) {
    console.log(req.body);
    req.body.taskRequester = req.session.uuid;
    models.tasks.create(req.body)
        .then(function (data) {
            res.send('New task request accepted!');
        })
        .catch(function (err) {
            console.log(err);
        });
    // res.send("HI.");
});

module.exports = router;
