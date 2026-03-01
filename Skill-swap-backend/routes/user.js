const express = require("express")
const router = express.Router() 
const auth = require("../middleware/auth")
const { updateProfile, getProfile } = require("../controllers/userController")
const upload = require("../middleware/upload")

router.put("/profile-update", auth, upload.single("profile_image"), updateProfile)

router.get("/",auth, getProfile)

module.exports = router 


