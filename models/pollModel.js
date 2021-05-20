const mongoose = require("mongoose");
const slugify = require("slugify");

const pollSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A poll must have a name"],
    unique: true
  },
  question: {
    type: String,
    required: [true, "A poll must have a question"],
    unique: true
  },
  options: {
    type: [String],
    required: [true, "A poll must have options"]
  },
  answers: {
    type: Object,
    required: [true, "A poll must have answers"]
  },
  responses: {
    type: Number,
    default: 0
  },
  colors: {
    type: [],
    default: ["#4e79a7", "#f28e2c", "#e15759", "#76b7b2", "#59a14f", "#edc949"]
  },
  tags: {
    type: [],
    default: []
  }
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
