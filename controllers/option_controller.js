const Options = require("../models/Options");
const Questions = require("../models/Questions");

//creating an option
module.exports.optionCreate = async (req, res) => {
  const question = await Questions.findById(req.params.question_id).catch(
    (err) => {
      return res.send("Question could not be found");
    }
  );

  const newOption = new Options();
  newOption.option = req.body.option;
  newOption.question_id = req.params.question_id;
  newOption.link_to_vote = `http://localhost:8000/options/${newOption.id}/add_vote`;

  await newOption.save().catch((err) => {
    return res.send("Could not save option to db");
  });

  //pushing options into the questions
  question.options.push(newOption.id);
  question.save().catch((err) => {
    return res.send("Could not push options into questions");
  });

  return res.send("Option created successfully");
};

//addvote
module.exports.optionAddVote = async (req, res) => {
  const option = await Options.findById(req.params.option_id).catch((err) => {
    return res.send("Could not find option");
  });

  option.votes = option.votes + 1;
  await option.save().catch((err) => {
    return res.send("Could not add vote");
  });

  return res.send("Voted successfully");
};

//option delete
module.exports.optionDelete = async (req, res) => {
  const option = await Options.findById(req.params.option_id).catch((err) => {
    return res.send("Could not find option");
  });

  if (option.votes > 0) {
    return res.send("Option cannot be deleted as it has votes");
  }

  await Options.findByIdAndDelete(req.params.option_id).catch((err) => {
    return res.send("Error in deleting the option");
  });

  return res.send("Successfully deleted the option");
};
