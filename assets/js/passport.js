const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../../server/model/User');

module.exports = function (passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://grumpy-teal-adder.cyclic.app/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const newUser = {
      email: profile._json.email,
      username: profile._json.name,
      // Just a placeholder because google authentication requires no password, 
      // this is so that it satisfies the User schema for mongoose :)
      password: 'googleAuthenticated'
    }
    try {
      let user = await User.findOne({ email: profile._json.email });
      if (user) {
        done(null, user);
      } else {
        user = await User.create(newUser);
        done(null, user);
      }
    } catch (err) {
      console.error(err);
    }
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, (err, user) => 
      done(err, user));
  });
}