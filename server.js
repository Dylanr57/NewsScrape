const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./models");

const app = express();
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);

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



app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});