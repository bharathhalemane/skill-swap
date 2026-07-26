const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('node:crypto')
const sendEmail = require('../utils/sendEmail')
const { isStrongPassword, PASSWORD_POLICY_MESSAGE } = require('../utils/passwordPolicy')

const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MS = 15 * 60 * 1000

exports.signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body || {};


        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({ message: PASSWORD_POLICY_MESSAGE })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        res.status(201).json({ message: "User registered successfully", userId: newUser._id });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.lockUntil && user.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 6000)
            return res.status(423).json({
                message: `Account temporarily locked due to repeated failed login attempts. Try again in ${minutesLeft} minutes(s).`
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
            if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
                user.lockUntil = Date.now() + LOCK_DURATION_MS
                user.failedLoginAttempts = 0
                await user.save()
                return res.status(423).json({
                    message: "Too many failed login attempts. Account locked for 15 minutes."
                })
            }
            await user.save()
            return res.status(400).json({ message: "Invalid Password" });
        }

        user.failedLoginAttempts = 0
        user.lockUntil = undefined

        const payload = {
            id: user._id,
        }

        const jwt_token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
        user.jwt_token = jwt_token
        await user.save()

        res.status(200).json({ jwt_token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body || {}

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.json({ message: "Password reset link sent to email if it exists" })
        }

        const resetToken = crypto.randomBytes(32).toString("hex")

        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex")

        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000

        await user.save()
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`

        const message = `
            <h2>Password Reset</h2>
            <p>You requested a password reset.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link expires in 15 minutes.</p>
        `

        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: message,
        })


        res.json({ message: "Password reset link sent to email if it exists" })

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password, confirmPassword } = req.body

        if (!password || !confirmPassword) {
            return res.status(400).json({ message: "password required" })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" })
        }

        if (!isStrongPassword(password)) {
            return res.status(400).json({message: PASSWORD_POLICY_MESSAGE})
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        })


        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" })
        }

        user.password = await bcrypt.hash(password, 10)
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        user.failedLoginAttempts = 0
        user.lockUntil = undefined

        await user.save()

        res.json({ message: "Password reset successful" })

    } catch (err) {
        res.status(500).json({ message: "server error" })
    }
}