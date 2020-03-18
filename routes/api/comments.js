const express = require("express");
const router = express.Router();

// Load Comment model
const Comment = require("../../models/Comment");

const CommentReply = require("../../models/CommentReply");

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May","Jun","Jul", "Aug", "Sep", "Oct", "Nov","Dec"];

// Setting Date format
const date = new Date();
const month = monthNames[date.getMonth()];
const year = date.getFullYear();
const fullDate = month + " " + year;

// Profanity filter for comments
const Filter = require('bad-words'),
      filter = new Filter();

let titleFiltered = "";
let descriptionFiltered = "";

// Get all posts for the particular route
router.get("/get/:section", (req, res) => {

    let sectionRoute = req.params.section

    Comment.find({section: sectionRoute}).then(comment => {
        res.json(comment);
    }).catch(err => {res.json(err)})
        
});

// Get specific post by id
router.get("/get/:section/:id", (req, res) => {
    let id = req.params.id;

    Comment.findById(id).then(comment => {
        res.json(comment);
    });       
});

// Get all replies for specific post
router.get("/get/:section/:id/replies", (req, res) => {
    let idPost = req.params.id;

    CommentReply.find({id: idPost}).then(reply => {
        res.json(reply);
    });       
});


// Create a post
router.post("/create", (req, res) => {

    titleFiltered = filter.clean(req.body.title);
    descriptionFiltered = filter.clean(req.body.description);
        
    const newComment = new Comment({
        section: req.body.section,
        author: req.body.author,
        title: titleFiltered,
        description: descriptionFiltered,
        date: fullDate,
        colour: req.body.colour
      });

    newComment.save().then(comment => res.json(comment)).catch(err => res.json(err));
});

// Create a reply
router.post("/createReply", (req, res) => {

    descriptionFiltered = filter.clean(req.body.description);
        
    const newReply = new CommentReply({
        id: req.body.id,
        section: req.body.section,
        author: req.body.author,
        description: descriptionFiltered,
        date: fullDate,
        colour: req.body.colour
      });

    newReply.save().then(reply => res.json(reply)).catch(err => res.json(err));
});

// Edit post
router.post("/update/:id", (req, res) => {

    Comment.findById(req.params.id).then(comment => {
        if (!comment)
            res.status(404).send("Data not found");
        else
            titleFiltered = filter.clean(req.body.title);
            descriptionFiltered = filter.clean(req.body.description);
            comment.title = titleFiltered;
            comment.description = descriptionFiltered;
            comment.date = fullDate
            comment.save().then(comment => {
                res.json(comment);
            })
            .catch(err => {
                res.status(400).send(err);
            });
        });

});

// Edit reply post
router.post("/updateReply/:id", (req, res) => {

    let id = req.params.id;

    CommentReply.findById(id).then(comment => {
        
            descriptionFiltered = filter.clean(req.body.description);
            comment.description = descriptionFiltered;
            comment.date = fullDate
            comment.save().then(reply => {
                res.json(reply);
            })
            .catch(err => {
                res.status(400).send(err);
            });
        })
        .catch(err => {
            res.status(200).send(err);
        })
}); 


// Delete post
router.delete("/delete/:section/:id", (req,res) => {

    Comment.findById(req.params.id).then(comment => {
        if (!comment)
            res.status(404).send("Data not found");
        else
        comment.delete().then(() => { 
                res.json("Post deleted");

            })
            .catch(err => {
                res.status(400).send("Delete not possible");
            });
        });
});

// Delete all post replies
router.delete("/delete/:section/:id/replies", (req,res) => {

    let idPost = req.params.id;

    CommentReply.find({id: idPost}).remove().then(() => {
        res.status(200).json("All replies deleted")
    }).catch(err => {
        res.status(200).json("Failed to delete replies")
    })

});

// Delete reply to post
router.delete("/delete/:id", (req,res) => {

    CommentReply.findById(req.params.id).then(comment => {
        if (!comment)
            res.status(404).send("Data not found");
        else
        comment.delete().then(() => { 
                res.json("Post deleted");

            })
            .catch(err => {
                res.status(400).send("Delete not possible");
            });
        });
});


module.exports = router;