const authMiddleware = (req, res, next) => {
    if (!req.user) {
      req.flash("error", "You can't access that page before logon.");
      console.log("Auth middleware");
      //res.redirect("/sessions/logon");
    } else {
      next();
    }
  };
  
  module.exports = authMiddleware;
  