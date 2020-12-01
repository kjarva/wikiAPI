const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express()

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

/* For an API to be restful it has to have routes that all behave the same way, i.e. 
a GET /articles would return all articles, but a DELETE /articles/exampleArticle would
delete only the article specified. the /articles route is for ALL articles regardless
of the http method used, while the /articles/exampleArticle route would only target that one article for whatever method is called on it, be it GET, DELETE, or PUT. */

app.route("/articles")

    .get((req, res) => {
        Article.find((err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })


    .post((req, res) => {
        console.log(req.body.title);
        console.log(req.body.content);

        // Gets the title and the content from the post request made
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send("succesfully added new article.");
            } else {
                res.send(err);
            }
        });
    })


    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("All articles succesfully deleted.");
            } else {
                res.send(err);
            }
        });
    });


app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else if (err) {
                res.send(err);
            } else {
                res.send("No matching article was found!");
            }
        });
    })

    .put((req, res) => {
        Article.replaceOne({ title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            (err, result) => {
                console.log(result);
                if (!err && res.ok === 1) {
                    res.send("Succesfully updated the article");
                } else {
                    res.send(err);
                }
            });
    })

    .patch((req, res) => {
        Article.updateOne({ title: req.params.articleTitle },
            { $set: req.body }, (err) => {
                if (!err) {
                    res.send("Succesfully updated the article");
                } else {
                    res.send(err);
                }
            });
    })


    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) {
                res.send("Succesfully deleted the article.")
            } else {
                res.send(err);
            }
        });
    });




/* All of the commented out code was the way the code was originally, however it's now
   refactored as a chain using app.route() as shown above. */



// app.get("/articles", (req, res) => {
//     Article.find((err, foundArticles) => {
//         if (!err) {
//             res.send(foundArticles);
//         } else {
//             res.send(err);
//         }
//     });

// });




// app.post("/articles", (req, res) => {
//     console.log(req.body.title);
//     console.log(req.body.content);

//     // Gets the title and the content from the post request made
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });

//     newArticle.save((err) => {
//         if (!err) {
//             res.send("succesfully added new article.");
//         } else {
//             res.send(err);
//         }
//     });
// });




// app.delete("/articles", (req, res) => {
//     Article.deleteMany((err) => {
//         if (!err) {
//             res.send("All articles succesfully deleted.");
//         } else {
//             res.send(err);
//         }
//     });
// });




app.listen(3000, () => {
    console.log("server running on port 3000");
})