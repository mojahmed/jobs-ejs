const express = require("express");
require("express-async-errors");
require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");

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


app.use(flash());

// Middleware to set flash messages in res.locals
app.use((req, res, next) => {
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  next(); 
});

// Secret word handling
app.get("/secretWord", (req, res) => {
  if (!req.session.secretWord) {
    req.session.secretWord = "syzygy";
  }
  res.render("secretWord", { secretWord: req.session.secretWord });
});

app.post("/secretWord", (req, res) => {
  if (req.body.secretWord.toUpperCase()[0] === "P") {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with P.");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed.");
  }
  res.redirect("/secretWord");
});

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
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
