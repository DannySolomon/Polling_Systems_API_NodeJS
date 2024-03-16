const express = require("express");
const router = express.Router();

//for authorization
const userController = require("../controllers/user_controller");

//route explaining the api
router.get("/", (req, res) => {
  res.render("home");
});

//users related route
router.use("/users", require("./users"));

//questions related route
router.use(
  "/questions",
  userController.authenticateToken,
  require("./questions")
);

//options related route
router.use("/options", userController.authenticateToken, require("./options"));

//for invalid routes
router.use((req, res) => {
  res.status(404).json({ error: "Invalid Path" });
});

module.exports = router;
