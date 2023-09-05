const mongoose = require("mongoose");

//db config
const db = require("../secrets/secret_keys").MongoURI;

//connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo Atlas Connected");
  })
  .catch((err) => {
    console.log("Error in connecting to Mongo Atlas", err);
  });
