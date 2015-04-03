(function () {
    'use strict';
    var dotenv = require('dotenv');
    dotenv.load();
    var express = require('express');
    var router = express.Router();
    var mongojs = require('mongojs');
    var db = mongojs('AutoPrivilege', ['cars']);
    var nodemailer = require('nodemailer');
    var smtpapi = require('smtpapi');
    var sendgrid_username = process.env.SENDGRID_USERNAME;
    var sendgrid_password = process.env.SENDGRID_PASSWORD;
    var to = process.env.TO;

    var sendgrid = require('sendgrid')(sendgrid_username, sendgrid_password);
    var email = new sendgrid.Email();

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
        console.log('ici');
        res.render('index');
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
    router.post('/api/postEmail', function (req, res) {

        var htmlBody = req.body.htmlBody;
        email.addTo(to);
        email.setFrom(to);
        email.setSubject('[sendgrid-php-example] Owl');
        email.setText('Owl are you doing?');
        email.setHtml(htmlBody);
        email.addSubstitution("%how%", "Owl");
        email.addHeader('X-Sent-Using', 'SendGrid-API');
        email.addHeader('X-Transport', 'web');

        sendgrid.send(email, function (err, json) {
            if (err) {
                return console.error(err);
            }
            console.log(json);
        });
    });
    module.exports = router;
}());