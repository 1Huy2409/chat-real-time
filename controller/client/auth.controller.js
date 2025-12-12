const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const md5 = require("md5");
const generateHelper = require("../../helper/generate");
const sendMailHelper = require("../../helper/sendMailHelper");

// register controller
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Register Page",
  });
};
module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email,
    delete: false,
  });
  if (existEmail) {
    req.flash("error", "Email này đã tồn tại 1 tài khoản!");
    return;
  }
  req.body.password = md5(req.body.password);
  const tokenUser = generateHelper.generateRandomString(20);
  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: req.body.password,
    tokenUser: tokenUser,
  });
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  await User.updateOne(
    { tokenUser: user.tokenUser },
    {
      statusOnline: "Online",
    }
  );
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
      userId: user.id,
      status: "Online",
    });
  });
  res.redirect("/");
};

// login controller
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Login Page",
  });
};
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    delete: false,
    status: "active",
  });
  if (!user) {
    req.flash("error", "Tài khoản này không tồn tại!");
    res.redirect("back");
    return;
  }
  if (md5(req.body.password) !== user.password) {
    req.flash("error", "Mật khẩu không đúng, vui lòng nhập lại!");
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  await User.updateOne(
    { tokenUser: user.tokenUser },
    {
      statusOnline: "Online",
    }
  );
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
      userId: user.id,
      status: "Online",
    });
  });
  res.redirect("/");
};

// logout controller
module.exports.logout = async (req, res) => {
  await User.updateOne(
    { tokenUser: res.locals.user.tokenUser },
    {
      statusOnline: "Offline",
    }
  );
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_STATUS_ONLINE", {
      userId: res.locals.user.id,
      status: "Offline",
    });
  });
  req.flash("success", "Đăng xuất thành công!");
  res.clearCookie("tokenUser");
  res.redirect("/");
};

// forgot password controller
module.exports.forgotPassword = async (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Forgot Password",
  });
};
module.exports.forgotPasswordPost = async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    delete: false,
    status: "active",
  });
  if (!user) {
    req.flash("error", "Email này không tồn tại tài khoản!");
    res.redirect("back");
    return;
  }
  const otp = generateHelper.generateRandomNumber(8);
  const forgotPassword = new ForgotPassword({
    email: req.body.email,
    otp: otp,
    expireAt: Date.now(),
  });
  await forgotPassword.save();
  let subject = "OTP CODE FOR CHANGING PASSWORD";
  let email = req.body.email;
  let html = `Your OTP code is: <b>${otp}</b>. This code is only valid for 3 minutes!`;
  sendMailHelper.sendMail(email, subject, html);
  res.redirect(`/user/password/otp?email=${req.body.email}`);
};
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/pages/user/otp-password", {
    pageTitle: "Confirm OTP code",
    email: email,
  });
};
module.exports.otpPasswordPost = async (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  const forgotPassword = await ForgotPassword.findOne({
    email: email,
  });
  if (!forgotPassword) {
    req.flash("error", "Tài khoản email này không tồn tại");
    res.redirect("/");
    return;
  }
  if (otp !== forgotPassword.otp) {
    req.flash("Mã otp không chính xác, vui lòng nhập lại!");
    res.redirect("back");
  } else {
    const user = await User.findOne({
      email: email,
    });
    if (user) {
      res.cookie("tokenUser", user.tokenUser);
    }
  }
  res.redirect("/user/password/reset");
};
//reset password
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Reset Password",
  });
};
module.exports.resetPasswordPost = async (req, res) => {
  const newPassword = req.body.password;
  const user = await User.findOne({
    tokenUser: req.cookies.tokenUser,
  });
  user.password = md5(newPassword);
  user.save();
  res.redirect("/");
};
