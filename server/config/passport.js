const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

const GitHubStrategy = require("passport-github2").Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const googlePic = profile.photos?.[0]?.value || null;

        let user = await User.findOne({ email });

        if (!user) {
          // 🆕 New user
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            password: "google-auth",
            profile: {
              profile_image: googlePic,
              imageType: "google"
            }
          });
        } else {
          // 🔁 Existing user

          // Ensure profile exists
          if (!user.profile) user.profile = {};

          // Update only if no custom image
          if (
            (!user.profile.profile_image || user.profile.imageType === "google") &&
            googlePic
          ) {
            user.profile.profile_image = googlePic;
            user.profile.imageType = "google";
            await user.save();
          }

          // Link Google account if not linked
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
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
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email']
    },

    async(accessToken, refreshToken, profile, done) => {
      try{
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`

        const githubPic = profile.photos?.[0]?.value || null

        let user = await User.findOne({email})

        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username, email,
            github: profile.id,
            password: 'github-auth',
            profile: {
              profile_image: githubPic,
              imageType: "google"
            }
          })
        } else {
          if (!user.profile) user.profile = {}

          if(
            (!user.profile.profile_image || user.profile.imageType === "google") && githubPic
          ) {
            user.profile.profile_image = githubPic;
            user.profile.imageType = "google";
            await user.save();
          }

          if (!user.githubId) {
            user.githubId = profile.id
            await user.save()
          }
        }
        return done(null, user)
      }catch(err){
        return done(err, null)
      }
    }
  )
)