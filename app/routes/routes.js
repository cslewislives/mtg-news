const express = require('express'),
    router = express.Router(),
    mongoose = require("mongoose"),
    cheerio = require("cheerio"),
    request = require('request');

const db = require("./../models");

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoHeadlines';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// router.get('/', (req, res) => {
//     res.render('index');
// });

router.get('/', (req, res) => {
    db.Article.find({'saved': false}).then(data => {
        let articleObj = {
            articles: data
        }
        res.render('index', articleObj);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/scrape', (req, res) => {
    request('https://magic.wizards.com/en/articles/archive', (error, response, html) => {
        let $ = cheerio.load(html);
        let added = [];
        $('div.article-item-extended').each((i, element) => {
            let result = {};

            result.title = $(element).children('a').children('div.text').children('div.title').children('h3').text();
            result.link = 'https://magic.wizards.com' + $(element).children('a').attr('href');
            result.author = $(element).children('a').children('div.text').children('div.title').children('p').children('span.author').text();
            result.description = $(element).children('a').children('div.text').children('div.description').text();
            added.push(result);
            db.Article.create(result).then(dbArticle => {
                console.log(dbArticle);
            }).catch(err => {
                console.log(err);
            });
        });
        res.send(`Added ${added.length} new articles!`);

    });
});


module.exports = router;