const express = require("express");
require("express-async-errors");
require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");
const app = express();
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

const url = process.env.MONGO_URI;


const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});


store.on("error", function (error) {
  console.log(error);
});


const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};


if (app.get("env") === "production") {
  app.set("trust proxy", 1); 
  sessionParms.cookie.secure = true; 
}

// Use session middleware
app.use(session(sessionParms));

// Passport middleware
passportInit();
app.use(passport.initialize());
app.use(passport.session());


app.use(flash());

// Middleware to set flash messages in res.locals
// app.use((req, res, next) => {
//   res.locals.info = req.flash("info");
//   res.locals.errors = req.flash("error");
//   next(); 
// });
app.use(require("./middleware/storeLocals"));
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", require("./routes/sessionRoutes"));

// Protect the /secretWord route with auth middleware
app.use("/secretWord", auth, secretWordRouter); 

// Handle 404
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});


app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
  (next);
});




const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
