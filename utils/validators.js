const mongoose = require("mongoose");

//id validation
const isValidObjectID = (objectId) => {
  if (mongoose.Types.ObjectId.isValid(objectId)) {
    return true;
  }
  return false;
};

module.exports = { isValidObjectID };
