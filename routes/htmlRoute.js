var express = require('express');
var router = express.Router();
var path = require("path");

router.get("/calendar", function(req, res){
  res.sendFile(path.join(__dirname, "../public/calendarTest.html"));
});

module.exports = router;
