(function () {
    'use strict';
    var express = require('express');
    var router = express.Router();
    var mongojs = require('mongojs');
    var db = mongojs('AutoPrivilege', ['cars']);
    /* GET home page. */
    router.get('/', function (req, res) {
        res.render('index');
    });
    router.get('/api/cars', function (req, res) {
        db.cars.find(function (err, data) {
            res.json(data);
        });
    });
    router.get('/api/cars/:_id', function (req, res) {
        db.cars.findOne({_id: mongojs.ObjectId(req.params._id)}, function (err, data) {
            res.json(data);
        });
    });
    router.post('/api/cars', function (req, res) {
        db.cars.insert(req.body, function (err, data) {
            res.json(data);
        });
    });
    router.put('/api/cars', function (req, res) {
        db.cars.update({
            _id: mongojs.ObjectId(req.body._id)
        }, {
            isCompleted: req.body.isCompleted,
            todo: req.body.todo
        }, {}, function (err, data) {
            res.json(data);
        });
    });
    router.delete('/api/cars/:_id', function (req, res) {
        db.cars.remove({
            _id: mongojs.ObjectId(req.params._id)
        }, '', function (err, data) {
            res.json(data);
        });
    });
    module.exports = router;
}());