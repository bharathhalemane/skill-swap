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
        const email = profile.emails[0].value

        let user = await User.findOne({ email })

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            password: 'google-auth',
          })
        }

        done(null, user)
      } catch (err) {
        done(err, null)
      }
    }
  )
)

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },

    async(accessToken, refreshToken, profile, done) => {
      try{
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`

        let user = await User.findOne({email})

        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username, email,
            github: profile.id,
            password: 'github-auth',         
          })
        }
        done(null, user)
      }catch(err){
        done(err, null)
      }
    }
  )
)