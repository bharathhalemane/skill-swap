const dns = require("node:dns").promises 

const EMAIL_FORMAT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isValidEmailFormat = (email) => {
    if (typeof email !== "string") return false 
    return EMAIL_FORMAT_REGEX.test(email.trim())
}

const domainHashMailServer = async (email) => {
    const domain = email.split("@")[1]
    if (!domain) return false 
    
    try {
        const records = await dns.resolveMax(domain)
        return Array.isArray(records) && records.length > 0
    } catch (err) {
        return false
    }
}


module.exports = { isValidEmailFormat, domainHashMailServer}