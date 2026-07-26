const isStrongPassword = (password) => {
    if (typeof password !== "string") return false
    if (password.length < 8) return false
    if (!/[a-z]/.test(password)) return false
    if (!/[A-Z]/.test(password)) return false
    if (!/[0-9]/.test(password)) return false
    return true
}

const PASSWORD_POLICY_MESSAGE = "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number."


module.exports = { isStrongPassword, PASSWORD_POLICY_MESSAGE }