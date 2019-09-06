var fs = require('fs');
var path = require('path');
var util = require("util");
var mongoose = require('mongoose');
var Article = require('../models/article.js');

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb+srv://test-user:eYXJLqnHRmusOcjI@iftest-4l1yx.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
mongoose.connect('mongodb://localhost:27017/h2o-demo', { useNewUrlParser: true })
    .then(() => console.log('connection succesful'))
    .catch((err) => console.error(err));

readDir(__dirname)
    .then(files => {
        var datafiles = files.filter(x => x.includes(".sgm"));
        datafiles.forEach((file, index) => {
            console.log(`File ${index} out of ${datafiles.length}: ${file}`);
            filePath = path.join(__dirname, file); 
            readFile(filePath, { encoding: 'utf-8' })
                .then(data => {
                    data.match(/(?<=\<REUTERS)[\s\S]+?(?=\<\/REUTERS\>)/g).forEach((article) => {
                        var a = parseArticle(article);
                        Article.create(a)
                            .then(result => console.log(`Article ${a._id} successfully created`))
                            .catch(error => console.log(error))
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        });
    })
    .catch(err => {
        console.log(err);
    })

function parseArticle(article) {
    return {
        lewissplit: (article.match(/(?<=LEWISSPLIT=\")[^"]+(?=")/)|| [""])[0],
        cgisplit: (article.match(/(?<=CGISPLIT=\")[^"]+(?=")/)|| [""])[0],
        oldid: (article.match(/(?<=OLDID=\")[^"]+(?=")/)|| [""])[0],
        _id: (article.match(/(?<=NEWID=\")[^"]+(?=")/)|| [""])[0],
        date: (article.match(/(?<=\<DATE\>)[^<]+(?=\<\/DATE\>)/)|| [""])[0],
        topics: article.match(/(?<=\<TOPICS\>).*(?=\<\/TOPICS\>)/g)[0].match(/(?<=\<D\>)[^<]+(?=\<\/D\>)/g) || [],
        places: article.match(/(?<=\<PLACES\>).*(?=\<\/PLACES\>)/g)[0].match(/(?<=\<D\>)[^<]+(?=\<\/D\>)/g) || [],
        people: article.match(/(?<=\<PEOPLE\>).*(?=\<\/PEOPLE\>)/g)[0].match(/(?<=\<D\>)[^<]+(?=\<\/D\>)/g) || [],
        orgs: article.match(/(?<=\<ORGS\>).*(?=\<\/ORGS\>)/g)[0].match(/(?<=\<D\>)[^<]+(?=\<\/D\>)/g) || [],
        exchanges: article.match(/(?<=\<EXCHANGES\>).*(?=\<\/EXCHANGES\>)/g)[0].match(/(?<=\<D\>)[^<]+(?=\<\/D\>)/g) || [],
        companies: article.match(/(?<=\<COMPANIES\>).*(?=\<\/COMPANIES\>)/g)[0].match(/(?<=\<D\>)[^<]+(?=\<\/D\>)/g) || [],
        unknown: (article.match(/(?<=\<UNKNOWN\>)[^<]+(?=\<\/UNKNOWN\>)/) || [""])[0],
        text: {
            title: (article.match(/(?<=\<TEXT)[\s\S]+?(?=\<\/TEXT\>)/g)[0].match(/(?<=\<TITLE\>)[^<]+(?=\<\/TITLE\>)/g)|| [""])[0],
            dateline: (article.match(/(?<=\<TEXT)[\s\S]+?(?=\<\/TEXT\>)/g)[0].match(/(?<=\<DATALINE\>)[^<]+(?=\<\/DATALINE\>)/g)|| [""])[0],
            body: (article.match(/(?<=\<TEXT)[\s\S]+?(?=\<\/TEXT\>)/g)[0].match(/(?<=\<BODY\>)[^<]+(?=\<\/BODY\>)/g)|| [""])[0]
        }
    }
}