const express = require("express")
const router = express.Router() 
const auth = require("../middleWare/auth")
const { updateProfile } = require("../controllers/userController")
const upload = require("../middleware/upload")

router.put("/profile-update", auth, upload.single("profileImage"), updateProfile)

module.exports = router 


