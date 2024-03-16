const express = require("express");
const usersRouter = express.Router();

const userController = require("../controllers/user_controller");

//route for user related actions

//user signup
usersRouter.post("/signup", userController.userSignUp);

//user login
usersRouter.post("/login", userController.userLogin);

//user refreshtoken
usersRouter.post("/tokenRefresh", userController.refreshToken);

module.exports = usersRouter;
