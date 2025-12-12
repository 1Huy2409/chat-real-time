const express = require("express");
const router = express.Router();
const controller = require("../../controller/client/auth.controller");
const userValidate = require("../../validates/client/auth.validate");

//router register
router.get("/register", controller.register);
router.post("/register", userValidate.registerPost, controller.registerPost);
//router login
router.get("/login", controller.login);
router.post("/login", userValidate.loginPost, controller.loginPost);
//router logout
router.get("/logout", controller.logout);
//router forgot password
router.get("/password/forgot", controller.forgotPassword);
router.post(
  "/password/forgot",
  userValidate.forgotPasswordPost,
  controller.forgotPasswordPost
);
//router otp password
router.get("/password/otp", controller.otpPassword);
router.post(
  "/password/otp",
  userValidate.otpPasswordPost,
  controller.otpPasswordPost
);
//router seset password
router.get("/password/reset", controller.resetPassword);
router.post(
  "/password/reset",
  userValidate.resetPasswordPost,
  controller.resetPasswordPost
);
module.exports = router;
