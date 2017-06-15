(function() {
  'use strict';
  var express = require('express');
  var router = express.Router();
  var mongojs = require('mongojs');
  var db = mongojs('expenseApp', ['expenses']);
  /* GET home page. */
  router.get('/', function(req, res) {
    res.render('index');
  });
  router.get('/expenses/:month/:year', function(req, res) {
    var month = parseInt(req.originalUrl.split('/')[3]);
    var year = parseInt(req.originalUrl.split('/')[4])+1900;
    var start = new Date(year, month).getTime();
    var end = new Date(year, month+1).getTime();
    db.expenses.find( {date: {$gte: start, $lt: end}}, function(err, data) {
      res.json(data);
    });
  });
  router.post('/expenses', function(req, res) {
    db.expenses.insert(req.body, function(err, data) {
      res.json(data);
    });
  });
  router.put('/expenses', function(req, res) {
    db.expenses.update({
      _id: mongojs.ObjectId(req.body._id)
    }, {
      isCompleted: req.body.isCompleted
    }, {}, function(err, data) {
      res.json(data);
    });
  });
  router.delete('/expenses/:_id', function(req, res) {
    db.expenses.remove({
      _id: mongojs.ObjectId(req.params._id)
    }, '', function(err, data) {
      res.json(data);
    });
  });
  module.exports = router;
}());
