const Options = require("../models/Options");
const Questions = require("../models/Questions");

const { isValidObjectID } = require("../utils/validators");

//creating an option
module.exports.optionCreate = async (req, res) => {
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

  if (!question) {
    return res.status(400).json({ error: "No such question id exist" });
  }

  const newOption = new Options();
  newOption.option = req.body.option;
  newOption.question_id = req.params.question_id;

  // Get the base URL dynamically from the request object
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  // Generate the dynamic URL for voting
  newOption.link_to_vote = `${baseUrl}/options/${newOption._id}/add_vote`;

  await newOption.save().catch((err) => {
    return res
      .status(500)
      .json({ error: "Error inn saving option to db", message: err });
  });

  //pushing options into the questions
  question.options.push(newOption.id);
  question.save().catch((err) => {
    return res
      .status(500)
      .json({ error: "Error in saving options in questions", message: err });
  });

  return res
    .status(200)
    .json({ message: "Option created successfully", option_id: newOption.id });
};

//addvote
module.exports.optionAddVote = async (req, res) => {
  //check if option_id is valid
  if (!isValidObjectID(req.params.option_id)) {
    return res.status(400).json({ error: "Invalid option ID format" });
  }

  const option = await Options.findById(req.params.option_id).catch((err) => {
    return res
      .status(500)
      .json({ error: "Error in finding the option", message: err });
  });

  if (!option) {
    return res.status(400).json({ error: "No such option exists" });
  }

  option.votes = option.votes + 1;
  await option.save().catch((err) => {
    return res
      .status(500)
      .json({ error: "Counld not add vote to option", message: err });
  });

  return res.status(200).json({ message: "Successfully voted" });
};

//option delete
module.exports.optionDelete = async (req, res) => {
  //check if option_id is valid
  if (!isValidObjectID(req.params.option_id)) {
    return res.status(400).json({ error: "Invalid option ID format" });
  }

  const option = await Options.findById(req.params.option_id).catch((err) => {
    return res
      .status(500)
      .json({ error: "Error in finding the option", message: err });
  });

  if (!option) {
    return res.status(400).json({ error: "Option ID does not exist" });
  }

  if (option.votes > 0) {
    return res
      .status(400)
      .json({ error: "Option cannot be deleted as it has votes" });
  }

  await Options.findByIdAndDelete(req.params.option_id).catch((err) => {
    return res
      .status(500)
      .json({ error: "Error in deleting the option", message: err });
  });

  return res.status(200).json({ message: "Successfully deleted the option" });
};
