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

router.get('/scrape', (req, res) => {
    request('https://magic.wizards.com/en/articles/archive', (error, response, html) => {
        let $ = cheerio.load(html);

        $('div.article-item-extended').each((i, element) => {
            let result = {};

            result.title = $(element).children('a').children('div.text').children('div.title').children('h3').text();
            result.link = $(element).children('a').attr('href');
            result.author = $(element).children('a').children('div.text').children('div.title').children('p').children('span.author').text();;
            result.description = $(element).children('a').children('div.text').children('div.description').text();

            db.Article.create(result).then(dbArticle => {
                console.log(dbArticle);
            });
        });

        res.send('Scrape Complete')
    });
});

router.get('/articles', (req, res) => {
    db.Article.find({}).then(data => {
        res.json(data);
    }).catch(err => {
        res.json(err);
    });
});

module.exports = router;