const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const UserModel = require("../models/Usermodel");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:3000"}/users/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ profileId: profile.id });
        if (!user) {
          user = await UserModel.create({
            name: profile.displayName,
            username: profile.emails[0].value.split("@")[0] + "_" + profile.id.slice(-4),
            email: profile.emails[0].value,
            password: Math.random().toString(36).slice(-10), // Random password for social login
            profileId: profile.id,
            profileUrl: profile.photos[0]?.value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:3000"}/users/auth/github/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ profileId: profile.id });
        if (!user) {
          const email = profile.emails?.[0]?.value || `github_${profile.id}@example.com`;
          user = await UserModel.create({
            name: profile.displayName || profile.username,
            username: profile.username || `github_user_${profile.id}`,
            email: email,
            password: Math.random().toString(36).slice(-10),
            profileId: profile.id,
            profileUrl: profile.photos?.[0]?.value,
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
