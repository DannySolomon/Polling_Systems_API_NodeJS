const mongoose = require("mongoose");
const Users = require("./Users");

const TokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users,
  },
  access_token: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
    required: true,
  },
});

const Tokens = mongoose.model("Token", TokenSchema);

module.exports = Tokens;
