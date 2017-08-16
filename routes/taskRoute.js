var models = require("../models");
var express = require('express');
var router = express.Router();

router.get("/", function (req, res, next) {
  models.tasks.findAll()
  .then(function (data) {
    var tasks = {
      events: [],
      className: "task" // adds class to all events
    };
    for (var i = 0; i < data.length; i++) {
      // Create data objects according to format that FullCalendar.io expects
      var vals = {
        "title": data[i].dataValues.taskName,
        "start": data[i].dataValues.taskDate,
        "claimed": data[i].dataValues.taskAccepted,
        "description": data[i].dataValues.taskDescription,
        "className": data[i].dataValues.taskAccepted ? "claimed" : "unclaimed",
        "claimedBy": data[i].dataValues.taskAccepter,
        "id": data[i].dataValues.id
      };
      tasks.events.push(vals);
    }
    res.json(tasks);
  })
  .catch(function(err) {
		console.log(err);
	});
});

router.post('/update/:id', function (req, res) {
  models.tasks.update(
    req.body,
    {
      where: { id: req.params.id }
    }
  )
  .then(function (data) {
    res.send("DONE.");
  });
});



router.post('/new', function(req, res){
  console.log(req.body);
  // console.log(models);
	models.tasks.create(req.body)
	.then(function(data) {
	    res.send('New task request accepted!');
	})
	.catch(function(err) {
		console.log(err);
	});
  // res.send("HI.");
});

module.exports = router;
