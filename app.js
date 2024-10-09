const express = require("express");
require("express-async-errors");
require("dotenv").config();
const app = express();
const session = require("express-session");
const secretWordRouter = require("./routes/secretWord");
const jobsRouter = require("./routes/jobs");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
const csrf = require("host-csrf");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests, please try again later.',
});


app.use(helmet()); // Sets various HTTP headers for security
app.use(xss()); // Sanitize user input to prevent XSS attacks
app.use(limiter); // Apply the rate limiting middleware

// const url = process.env.MONGO_URI;


const MongoDBStore = require("connect-mongodb-session")(session);
let mongoURL = process.env.MONGO_URI;
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_ENV = 'test'; 
}



const store = new MongoDBStore({
  uri: mongoURL,
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
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session(sessionParms));

let csrf_development_mode = true;
if (app.get("env") === "production") {
  csrf_development_mode = false;
  app.set("trust proxy", 1);
}

const csrf_options = {
  protected_operations: ["POST", "PATCH", "PUT"], 
  protected_content_types: ["application/x-www-form-urlencoded", "application/json"], 
  development_mode: csrf_development_mode,
  header_name: "csrf-token", 
};

app.use(csrf(csrf_options));

const passport = require("passport");
const passportInit = require("./passport/passportInit");

passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.use(require("connect-flash")());
app.use(require("./middleware/storeLocals"));

app.get("/", (req, res) => {
  res.render("index");
});


// Multiply endpoint
// app.get("/multiply", (req, res) => {
//   const first = parseFloat(req.query.first);
//   const second = parseFloat(req.query.second);

//   if (isNaN(first) || isNaN(second)) {
//     return res.status(400).json({ result: "NaN" });
//   }

//   const result = first * second;
//   res.json({ result });
// });

// // Middleware for setting Content-Type
// app.use((req, res, next) => {
//   if (req.path === "/multiply") {
//     res.set("Content-Type", "application/json");
//   } else {
//     res.set("Content-Type", "text/html");
//   }
//   next();
// });

app.get("/multiply", (req, res) => {
  const first = parseFloat(req.query.first);
  const second = parseFloat(req.query.second);
  
  // Check if either of the inputs is NaN
  if (isNaN(first) || isNaN(second)) {
      return res.status(200).json({ result: "NaN" });
  }
  
  const result = first * second;
  res.json({ result: result });
});

app.use((req, res, next) => {
  if (req.path == "/multiply") {
    res.set("Content-Type", "application/json");
  } else {
    res.set("Content-Type", "text/html");
  }
  next();
});

app.use("/sessions", require("./routes/sessionRoutes"));
app.use("/secretWord", auth, secretWordRouter);
app.use("/jobs", auth, jobsRouter);

app.set("view engine", "ejs");

app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

app.use((err, req, res, next) => {
  console.log(err); 
  res.status(500).send(err.message);
  next();
});

const port = process.env.PORT || 3000;

const start = () => {
  try {
    require("./db/connect")(mongoURL);
    return app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();

module.exports = { app };
