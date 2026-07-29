const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('node:crypto')
const sendEmail = require('../utils/sendEmail')
const { isStrongPassword, PASSWORD_POLICY_MESSAGE } = require('../utils/passwordPolicy')
const { isValidEmailFormat, domainHasMailServer } = require('../utils/emailValidator')
const { generateOtp, hashOtp, OTP_EXPIRY_MS } = require("../utils/otp")


const MAX_FAILED_ATTEMPTS = 5
const LOCK_DURATION_MS = 15 * 60 * 1000

const MAX_OTP_ATTEMPTS = 5

const sendOtpEmail = async (user, otp) => {
    const message = `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f5; padding: 32px 0;">
          <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <div style="background-color: #E8724B; padding: 24px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">Skill Swap</h1>
            </div>
            <div style="padding: 32px;">
              <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 18px;">Verify your email</h2>
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                Use the code below to verify your Skill Swap account. It expires in 10 minutes.
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <span style="display: inline-block; background-color: #f9fafb; border: 1px solid #f0f0f0; border-radius: 8px; padding: 16px 32px; font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #E8724B;">
                  ${otp}
                </span>
              </div>
              <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                If you didn't create a Skill Swap account, you can safely ignore this email.
              </p>
            </div>
            <div style="background-color: #f9fafb; padding: 16px 32px; border-top: 1px solid #f0f0f0;">
              <p style="margin: 0; color: #9ca3af; font-size: 11px;">Skill Swap · Peer-to-peer skill exchange for students</p>
            </div>
          </div>
        </div>
    `

    await sendEmail({
        to: user.email,
        subject: "verify your Skill Swap account",
        html: message,
    })
}

exports.signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phoneNumber } = req.body || {};


        if (!name || !email || !password || !confirmPassword || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!isValidEmailFormat(email)) {
            return res.status(400).json({ message: "Please enter a valid email address" });
        }
        const domainOk = await domainHasMailServer(email)
        if (!domainOk) {
            return res.status(400).json({ message: "This email domain doesn't appear to accept mail. Please check for typos." })
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

        const otp = generateOtp()

        const newUser = await User.create({
            name, email, password: hashedPassword, phoneNumber,
            isVerified: true,
            emailOTP: hashOtp(otp),
            emailOTPExpire: Date.now() + OTP_EXPIRY_MS,
        })

        await sendOtpEmail(newUser, otp)

        res.status(201).json({ message: "Account created. Please check your email for verification code.", userId: newUser._id });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body || {}
        if (!email || !otp) {
            return res.status(400).json({ message: "Email and code are required" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or code" })
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Account is already verified" })
        }

        if (!user.emailOTP || !user.emailOTPExpire || user.emailOTPExpire < Date.now()) {
            return res.status(400).json({ message: "Code expired. Please request a new one." })
        }

        if (hashOtp(otp) !== user.emailOTP) {
            user.otpAttempts = (user.otpAttempts || 0) + 1
            if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
                user.emailOTP = undefined
                user.emailOTPExpire = undefined
                user.otpAttempts = 0
                await user.save()
                return res.status(400).json({ message: "Too many incorrect attempts. Please request a new code." })
            }
            await user.save()
            return res.status(400).json({ message: "Incorrect code" })
        }

        user.isVerified = true
        user.emailOTP = undefined
        user.emailOTPExpire = undefined
        user.otpAttempts = 0
        await user.save()

        res.json({ message: "Email verified successfully, You can now log in." })
    } catch (err) {
        res.status(500).json({ message: "Server error" })
    }
}

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body || {}
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await User.findOne({ email })

        if (!user || user.isVerified) {
            return res.json({ message: "If an unverified account exists for this email, a new code has been sent." })
        }

        const otp = generateOtp()
        user.emailOTP = hashOtp(otp)
        user.emailOTPExpire = Date.now() + OTP_EXPIRY_MS
        user.otpAttempts = 0
        await user.save()

        await sendOtpEmail(user, otp)

        res.json({ message: "If an unverified account exists for this email, a new code has been sent." })
    } catch (err) {
        res.status(500).json({ message: "Server error" })
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
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000)
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

        if (!user.isVerified) {
            const otp = generateOtp()
            user.emailOTP = hashOtp(otp)
            user.emailOTPExpire = Date.now() + OTP_EXPIRY_MS
            user.otpAttempts = 0
            await user.save()
            await sendOtpEmail(user, otp)

            return res.status(403).json({
                message: "Please verify your email before logging in.",
                requiresVerification: true,
            })
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
<div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f5; padding: 32px 0;">
  <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
    
    <div style="background-color: #E8724B; padding: 24px 32px;">
      <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600;">Skill Swap</h1>
    </div>

    <div style="padding: 32px;">
      <h2 style="margin: 0 0 16px; color: #1a1a1a; font-size: 18px;">Reset your password</h2>
      <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
        We received a request to reset the password for your Skill Swap account. Click the button below to choose a new password.
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetUrl}" style="background-color: #E8724B; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; display: inline-block;">
          Reset Password
        </a>
      </div>

      <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px; line-height: 1.5;">
        This link will expire in <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this email — your password will remain unchanged.
      </p>

      <p style="margin: 20px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
        Having trouble with the button? Copy and paste this link into your browser:<br>
        <span style="color: #E8724B; word-break: break-all;">${resetUrl}</span>
      </p>
    </div>

    <div style="background-color: #f9fafb; padding: 16px 32px; border-top: 1px solid #f0f0f0;">
      <p style="margin: 0; color: #9ca3af; font-size: 11px;">
        Skill Swap · Peer-to-peer skill exchange for students
      </p>
    </div>

  </div>
</div>
`

        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: message,
        })


        res.json({ message: "Password reset link sent to email" })

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
            return res.status(400).json({ message: PASSWORD_POLICY_MESSAGE })
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