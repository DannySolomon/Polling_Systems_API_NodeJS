const express = require("express");
const questionsRouter = express.Router();

const questionController = require("../controllers/question_controller");

//route for all question related

//to view all questions
questionsRouter.get("/", questionController.questionsView);

//view a question
questionsRouter.get("/:question_id", questionController.questionView);

//create a question
questionsRouter.post("/create", questionController.questionCreate);

//delete a question
questionsRouter.delete(
  "/:question_id/delete",
  questionController.questionDelete
);

module.exports = questionsRouter;
