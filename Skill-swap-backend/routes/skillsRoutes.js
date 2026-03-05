const express = require("express")
const { getAllSkills,  getSkillById, addSkill, getSkillsByUserId, deleteSkill, updateSkill} = require("../controllers/skillController")
const upload = require('../middleware/upload')
const auth = require('../middleware/auth')


const router = express.Router()

// GET ALL SKILLS
router.get("/", getAllSkills)

// GET SINGLE SKILL BY ID
router.get("/:skillId", getSkillById)

//ADD SKILL
router.post("/add-skill", auth, upload.single("image"), addSkill)

//GET SKILL BY USERID
router.get("/user/:userId", auth, getSkillsByUserId)

//DELETE SKILL
router.delete("/delete/:skillId", auth, deleteSkill)

//UPDATE SKILL
router.put("/update/:skillId", auth,upload.single("image"), updateSkill)
module.exports = router