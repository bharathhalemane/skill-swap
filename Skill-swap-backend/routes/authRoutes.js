const express = require("express")
const { signup, login, forgotPassword, resetPassword } = require("../controllers/authController")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)

router.get("/google", passport.authenticate("google", {
    scope: ["profile","email"]
}))

router.get("/google/callback", passport.authenticate("google", { session: false }),async (req, res) => {
    const payload = {
        userId: req.user._id,
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });    

    res.redirect(
      `${process.env.FRONTEND_URL}/find-skills?token=${jwtToken}&userId=${req.user._id}` 
    )
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get('/github/callback', passport.authenticate('github', { session: false }),async (req, res) => {
    const payload = {
        userId: req.user._id,
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });    

    res.redirect(
      `${process.env.FRONTEND_URL}/find-skills?token=${jwtToken}&userId=${req.user._id}` //This URL should match your frontend URL
    )
})

router.post("/forgot-password", forgotPassword)
router.post("/reset-password/:token", resetPassword)



module.exports = router 
