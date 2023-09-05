const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  option: {
    type: String,
    required: true,
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
  link_to_vote: {
    type: String,
    required: true,
  },
});

const Options = mongoose.model("Options", OptionSchema);
module.exports = Options;
