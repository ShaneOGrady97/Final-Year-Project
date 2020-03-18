const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create comment Schema
let CommentReplySchema = new Schema({
  id: { // Original post
        type: String,
        required: true
  },
  section: { // For returning particular comments depending on route we are in e.g. news or general 
    type: String,
    required: true
  },
  author: {  
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

module.exports = CommentReply = mongoose.model("commentReplies", CommentReplySchema);