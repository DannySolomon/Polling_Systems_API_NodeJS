const Options = require("../models/Options");
const Questions = require("../models/Questions");

const { isValidObjectID } = require("../utils/validators");

//view all questions
module.exports.questionsView = async (req, res) => {
  //get all the documents from Questions collection
  const questions = await Questions.find({})
    .populate("options")
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Error in retriving the questions", message: err });
    });

  return res.status(200).send(questions);
};

//create a question
module.exports.questionCreate = async (req, res) => {
  //create new instance of question
  const newquestion = new Questions();

  //get the data from req.body(ie from url-encoded)
  newquestion.question = req.body.question;

  //save to upload to mongo atlas
  await newquestion.save().catch((err) => {
    return res
      .status(500)
      .json({ error: "Couldnt create question", message: err });
  });

  return res.status(200).json({
    message: "Question created successfully",
    question_id: newquestion.id,
  });
};

//view a particular question
module.exports.questionView = async (req, res) => {
  //check if quesion_id is valid
  if (!isValidObjectID(req.params.question_id)) {
    return res.status(400).json({ error: "Invalid question ID format" });
  }

  //retrive question by id from db
  const question = await Questions.findById(req.params.question_id)
    .populate("options")
    .catch((err) => {
      return res
        .status(500)
        .json({ error: "Error in retrieving the question", message: err });
    });

  if (!question) {
    return res.status(400).json({ error: "No such question id exist" });
  }

  return res.send(question);
};

//delete a question
module.exports.questionDelete = async (req, res) => {
  //check if quesion_id is valid
  if (!isValidObjectID(req.params.question_id)) {
    return res.status(400).json({ error: "Invalid question ID format" });
  }

  const question = await Questions.findById(req.params.question_id).catch(
    (err) => {
      return res
        .status(500)
        .json({ error: "Error in finding the question", message: err });
    }
  );

  //checking if any of the options have votes
  const options = await Options.find({
    question_id: req.params.question_id,
  }).catch((err) => {
    return res.status(500).json({
      error: "Error in finding options for the question",
      message: err,
    });
  });

  //checking if options have votes and not allowing to delete the questions with options having votes in them
  if (options.length != 0) {
    let isVotesthere = false;
    for (let option of options) {
      if (option.votes > 0) {
        isVotesthere = true;
        break;
      }
    }
    if (isVotesthere) {
      return res
        .status(200)
        .json({ message: "Cannot delete question because options have vote" });
    }

    //deleting all the options
    await Options.deleteMany({ question_id: req.params.question_id }).catch(
      (err) => {
        return res.status(500).json({
          error: "Error in deleting the options for the question",
          message: err,
        });
      }
    );
  }

  //deleting the question
  await Questions.deleteOne(question._id).catch((err) => {
    return res
      .status(500)
      .json({ error: "Error in deleting the question", message: err });
  });

  return res.status(200).json({ message: "Successfully deleted the question" });
};
