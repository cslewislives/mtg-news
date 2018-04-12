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
    db.Article.find({
        'saved': false
    }).sort({
        date: -1
    }).then(data => {
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

        $('div.article-item-extended').each((i, element) => {
            let result = {};
            let drillDown = $(element).children('a').children('div.text');

            result.title = drillDown.children('div.title').children('h3').text();

            result.link = 'https://magic.wizards.com' + $(element).children('a').attr('href');

            result.author = drillDown.children('div.title').children('p').children('span.author').text();

            result.description = drillDown.children('div.description').text();

            result.date = Date.now();

            db.Article.create(result).then(dbArticle => {
                console.log(dbArticle);
            }).catch(err => {
                console.log(err);
            });
        });
        res.send(`Scrape Complete!`);

    });
});

router.post('/saved/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    db.Article.findOneAndUpdate({
        _id: id
    }, {
        saved: true
    }, result => {
        res.send('Article has been saved');
    })
})

router.get('/saved', (req, res) => {
    db.Article.find({
        'saved': true
    }).then(data => {
        let articleObj = {
            articles: data
        }
        res.render('saved', articleObj);
    }).catch(err => {
        res.json(err);
    });
});

router.get('/articles/:id', (req, res) => {
    let id = req.params.id;

    db.Article.findOne({_id: id}).populate('notes').then(dbArticle => {
        res.json(dbArticle)
    }).catch(err => {
        res.json(err);
    });
});

router.post('/articles/:id', (req, res) => {
    let id = req.params.id;
    console.log(req.body);
    db.Note.create(req.body).then(dbNote => {
        db.Article.findOneAndUpdate({_id: id}, {$push: {notes: dbNote._id} }, {new: true}).then(dbArticle => {
            res.json(dbArticle);
        }).catch(err => {
            res.json(err);
        });
    });


});


module.exports = router;