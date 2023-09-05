const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Options",
    },
  ],
});

const Questions = mongoose.model("Questions", QuestionSchema);
module.exports = Questions;
