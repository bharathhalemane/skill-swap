const express = require("express")
const router = express.Router() 
const auth = require("../middleware/auth")
const { updateProfile, getProfile, updatePhoneNumber } = require("../controllers/userController")
const upload = require("../middleware/upload")

router.put("/profile-update", auth, upload.single("profile_image"), updateProfile)

router.get("/:userId",auth, getProfile)

router.put("/phone-number", auth, updatePhoneNumber)

module.exports = router 


