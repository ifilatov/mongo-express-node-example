'use strict';
var express = require('express');
var router = express.Router();
var Article = require('../models/article.js');

/* GET ALL ARTICLES */
router.get('/', function (req, res, next) {
    Article.find()
        //.then(articles => res.json(articles))
        .then(articles => res.json(articles.map(x => `{id:${x._id}, title:${x.text.title}}`)))
        .catch(err => next(err))
});

/* SEARCH ARTICLES BY FREEFORM TEXT */
router.get('/search', function (req, res, next) {
    Article.find({ 'text.title': new RegExp(req.query.q, "ig")})
        .then(article => res.json(article))
        .catch(err => next(err))
});

/* GET SINGLE ARTICLE BY ID */
router.get('/:id', function (req, res, next) {
    Article.findById(req.params.id)
        .then(article => res.json(article))
        .catch (err => next(err))
});

module.exports = router;
