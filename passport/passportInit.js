const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

const passportInit = () => {
  passport.use(
    "local",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email: email });
          if (!user) {
            return done(null, false, { message: "Incorrect credentials." });
          }

          const result = await user.comparePassword(password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect credentials." });
          }
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.serializeUser(async function (user, done) {
    console.log("Serializing user ID:", user.id);
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    // console.log("Deserializing user with ID:", id);
    try {
      const user = await User.findById(id);
      if (!user) {
        // console.error("User not found for ID:", id);
        return done(new Error("user not found"));
      }
      return done(null, user);
    } catch (e) {
      console.error("Error during deserialization:", e);
      done(e);
    }
  });
};

module.exports = passportInit;
