const crypto = require("node:crypto")

const OTP_LENGTH = 6
const OTP_EXPIRY_MS = 10 * 60 * 1000

const generateOtp = () => {
    const min = 10 ** (OTP_LENGTH - 1)
    const max = 10 ** OTP_LENGTH - 1

    return crypto.randomInt(min, max + 1).toString()
}

const hashOtp = (otp) => crypto.createHash("sha256").update(otp).digest("hex")

module.exports = { generateOtp, hashOtp, OTP_EXPIRY_MS }

