const express = require("express");
require("express-async-errors");
require("dotenv").config();
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");
const secretWordRouter = require("./routes/secretWord");
const auth = require("./middleware/auth");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET));

const url = process.env.MONGO_URI;
const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});

store.on("error", (error) => {
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

app.use(session(sessionParms));

// CSRF Middleware
const csrf_options = {
  protected_operation: ["PATCH"],
  protected_content_types: ["application/json"],
  development_mode: app.get("env") !== "production",

};

const csrf_middleware = csrf(csrf_options);

// Passport initialization
passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(require("./middleware/storeLocals"));

// Routes


// Logon route with CSRF token
app.use(require("./middleware/storeLocals.js"));





app.get("/", csrf_middleware, (req, res) => {
  res.render('index');
});

app.get("/logon", csrf_middleware, (req, res) => {
  res.render("logon", {csrfToken: req.signedCookies.csrfToken});
});
// Other routes
app.use("/sessions", csrf_middleware, require("./routes/sessionRoutes"));
app.use("/secretWord", auth, csrf_middleware, secretWordRouter);

// Handle 404
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
  next();
});

// Start server
const port = process.env.PORT || 3000;

const start = async () => {
  try {
    if (!url || !process.env.SESSION_SECRET) {
      throw new Error("Missing environment variables.");
    }
    await require("./db/connect")(url);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();