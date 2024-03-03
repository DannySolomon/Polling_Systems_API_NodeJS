const mongoose = require("mongoose");

require("dotenv").config();

//connect to Mongo
mongoose
  .connect(process.env.MongoURI, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo Atlas Connected");
  })
  .catch((err) => {
    console.log("Error in connecting to Mongo Atlas", err);
  });
