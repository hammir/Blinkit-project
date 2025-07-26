const express = require("express");
const app = express();

require("dotenv").config();
const {connectDb} = require('./config/mongooseConnect');
const indexrouter = require("./router/indexRouter");
const authrouter = require("./router/authRoute");
const adminrouter = require("./router/adminRoute");
const passport = require("passport");
const cookieParser = require("cookie-parser");
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
app.use(cookieParser());

app.use("/", indexrouter);
app.use("/auth", authrouter);
app.use("/admin", adminrouter);

app.listen(process.env.PORT, function () {
  console.log("listening on port " + process.env.PORT);
});
