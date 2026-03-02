const express = require("express")
const { getAllSkills,  getSkillById, addSkill} = require("../controllers/skillController")
const upload = require('../middleware/upload')
const auth = require('../middleware/auth')

const router = express.Router()

// GET ALL SKILLS
router.get("/", getAllSkills)

// GET SINGLE SKILL BY ID
router.get("/:id", getSkillById)

//add skill
router.post("/add-skill",auth, upload.single("image"), addSkill)

module.exports = router