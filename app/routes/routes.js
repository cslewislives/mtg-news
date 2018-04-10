const express = require('express'),
    router = express.Router(),
    mongoose = require("mongoose"),
    cheerio = require("cheerio"),
    request = require('request');
    
const db = require("./../models"); 
    
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;