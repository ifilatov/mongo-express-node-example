var mongoose = require('mongoose');

var ArticleSchema = new mongoose.Schema({
    lewissplit: String,
    cgisplit: String,
    oldid: String,
    _id: String,
    date: String,
    topics: [String],
    places: [String],
    people: [String],
    orgs: [String],
    exchanges: [String],
    companies: [String],
    unknown: String,
    text: {
        title: String,
        dateline: String,
        body: String
    }
});

module.exports = mongoose.model('Article', ArticleSchema);