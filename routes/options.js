const express = require("express");
const optionsRouter = express.Router();

const optionController = require("../controllers/option_controller");

//route for all option related

//create an option
optionsRouter.post("/:question_id/create", optionController.optionCreate);

//delete an option
optionsRouter.delete("/:option_id/delete", optionController.optionDelete);

//add vote to option
optionsRouter.get("/:option_id/add_vote", optionController.optionAddVote);

module.exports = optionsRouter;
