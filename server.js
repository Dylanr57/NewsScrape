const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

const app = express();
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));
var databaseUri = "mongodb://localhost/mongoHeadlines"

if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
    console.log("connected online db");
}else{
    mongoose.connect(databaseUri);
    console.log("connected local db");
}

app.get("/scrape",function(req,res){

    axios.get("https://www.gamespot.com/news/").then(function(response) {
        var $ = cheerio.load(response.data);

        $("article.media.media-article").each(function(i, element) {
            var result = {};

            result.title = $(this).find("h3.media-title").text();
            result.summary = $(this).find("p.media-deck").text();
            result.link = $(this).find("a").attr("href");
            result.image = $(this).find("img").attr("src");
            db.Article.create(result)
            .then(function(dbArticle){
                console.log(dbArticle);
            })
            .catch(function(err){
                console.log(err);
            });
        });


    });

    res.send("Scrape Complete");

});

app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.get("/articles/:id", function(req, res){
    db.Article.findOne({_id: req.params.id})
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.post("/articles/:id", function(req,res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return dbArticle.findOneAndUpdate({ _id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    })
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});