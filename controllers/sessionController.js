const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErr"); 

const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res, next) => {
  console.log("TEST")
  console.log(req.body);
  if (req.body.password != req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    res.render("register");
  }
  try {
    await User.create(req.body);
    // console.log(req)
  } catch (e) {
    console.log(e);
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("register");
  }
  res.redirect("/");
};

const logoff = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
  // , {
  //   errors: req.flash("error"),
  //   info: req.flash("info"),
  // }
  // );
};

module.exports = {
  registerShow,
  registerDo,
  logoff,
  logonShow,
};