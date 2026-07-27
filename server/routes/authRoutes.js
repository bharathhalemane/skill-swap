const express = require("express")
const { signup, login, forgotPassword, resetPassword, verifyOtp, resendOtp } = require("../controllers/authController")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const {
    loginLimiter,
    signupLimiter,
    forgotPasswordLimiter,
    resetPasswordLimiter,
    verifyOtpLimiter,
    resendOtpLimiter
} = require("../middleware/rateLimiter")
const router = express.Router()

router.post("/signup", signupLimiter, signup)
router.post("/login", loginLimiter, login)
router.post("/verify-otp", verifyOtpLimiter, verifyOtp)
router.post("/resend-otp", resendOtpLimiter, resendOtp)

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}))

router.get("/google/callback", passport.authenticate("google", { session: false }), async (req, res) => {
    const payload = {
        id: req.user._id,
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.redirect(
        `${process.env.FRONTEND_URL}/home?token=${jwtToken}&userId=${req.user._id}`
    )
})

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get('/github/callback', passport.authenticate('github', { session: false }), async (req, res) => {
    const payload = {
        id: req.user._id,
    }
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.redirect(
        `${process.env.FRONTEND_URL}/home?token=${jwtToken}&userId=${req.user._id}` //This URL should match your frontend URL
    )
})

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword)
router.post("/reset-password/:token", resetPasswordLimiter, resetPassword)



module.exports = router 
