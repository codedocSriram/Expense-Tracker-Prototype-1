const express = require("express");
const userController = require("../controller/userController");
const forgotPasswordController = require("../controller/resetpasswordController");
const usersRouter = express.Router();

usersRouter.post("/add", userController.addNewUser);
usersRouter.post("/login", userController.checkUser);
usersRouter.get(
  "/called/password/forgotpassword",
  forgotPasswordController.forgotPassword
);
usersRouter.get("/called/password/checkotp", forgotPasswordController.checkOtp);
usersRouter.get(
  "/called/password/reset",
  forgotPasswordController.saveNewPassword
);
usersRouter.get("/test", userController.testPagination);
module.exports = usersRouter;
