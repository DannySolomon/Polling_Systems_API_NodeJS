const Options = require("../models/Options");
const Questions = require("../models/Questions");

//view all questions
module.exports.questionsView = async (req, res) => {
  //get all the documents from Questions collection
  const questions = await Questions.find({})
    .populate("options")
    .catch((err) => {
      return res.send("Error in retriving the questions ", err);
    });

  if (questions.length != 0) {
    return res.send(questions);
  } else {
    return res.send("No questions are available");
  }
};

//create a question
module.exports.questionCreate = async (req, res) => {
  //create new instance of question
  const newquestion = new Questions();

  //get the data from req.body(ie from url-encoded)
  newquestion.question = req.body.question;

  //save to upload to mongo atlas
  await newquestion.save().catch((err) => {
    return res.send("Couldnt create question ", err);
  });

  return res.send("Question created successfully");
};

//view a particular question
module.exports.questionView = async (req, res) => {
  //retrive question by id from db
  const question = await Questions.findById(req.params.question_id)
    .populate("options")
    .catch((err) => {
      return res.send("Error in retriving the question ", err);
    });

  console.log(question.options);

  return res.send(question);
};

//delete a question
module.exports.questionDelete = async (req, res) => {
  const question = await Questions.findById(req.params.question_id).catch(
    (err) => {
      return res.send("Error in finding the question ");
    }
  );
  //checking if any of the options have votes
  const options = await Options.find({
    question_id: req.params.question_id,
  }).catch((err) => {
    return res.send("Error in finding options for the question ");
  });
  if (options.length != 0) {
    let isVotesthere = false;
    for (let option of options) {
      if (option.votes > 0) {
        isVotesthere = true;
        break;
      }
    }
    if (isVotesthere) {
      return res.send("Cannot delete question because options have vote");
    }
    //deleting all the options
    await Options.deleteMany({ question_id: req.params.question_id }).catch(
      (err) => {
        return res.send("Error in deleting the options for the question ");
      }
    );
  }
  //deleting the question
  await Questions.deleteOne(question._id).catch((err) => {
    return res.send("Error in deleting the question");
  });

  return res.send("Successfully deleted the question");
};
