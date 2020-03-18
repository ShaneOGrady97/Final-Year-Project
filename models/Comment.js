const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create comment Schema
let CommentSchema = new Schema({
  section: { // For returning particular comments depending on route we are in e.g. news or general 
    type: String,
    required: true
  },
  author: {  
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  colour: {
    type: String,
    required: true
  }
});

module.exports = Comment = mongoose.model("comments", CommentSchema);
