const express = require("express");
const app = express();

require("dotenv").config();
const {connectDb} = require('./config/mongooseConnect');
const indexrouter = require("./router/indexRouter");
const authrouter = require("./router/authRoute");
const passport = require("passport");
const expressSession = require("express-session");
require('./config/googleStrategy');

connectDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
  resave:false,
  secret:process.env.EXPRESS_SECRET,
  saveUninitialized:false,
}));
app.use(express.static("public")); 

app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());


app.use("/", indexrouter);
app.use("/auth", authrouter);

app.listen(process.env.PORT, function () {
  console.log("listening on port " + process.env.PORT);
});
