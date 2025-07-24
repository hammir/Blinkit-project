const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const {userModel} = require("../models/userModel");

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async function (accessToken, refreshToken, profile, done) {
      try {
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          user = new userModel({
            email: profile.emails[0].value,
            name: profile.displayName,
          });
        }

        await user.save();
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//passport.serializeUser is used to store the user ID in the express session

passport.serializeUser((user, done) => {
  done(null, user._id);
});

//passport.deserializeUser is used to retrieve the user object from the database using the user ID stored in the session
passport.deserializeUser(async (id, done) => {
  let user = await userModel.findOne({_id:id});
  done(null, user);
});

module.exports = passport;