const express = require("express")
const { getAllSkills,  getSkillById, addSkill, getSkillsByUserId, deleteSkill, updateSkill} = require("../controllers/skillController")
const upload = require('../middleware/upload')
const auth = require('../middleware/auth')


const router = express.Router()

// GET ALL SKILLS
router.get("/", getAllSkills)

// GET SINGLE SKILL BY ID
router.get("/:id", getSkillById)

//ADD SKILL
router.post("/add-skill", auth, upload.single("image"), addSkill)

//GET SKILL BY USERID
router.get("/user/:userId", getSkillsByUserId)

//DELETE SKILL
router.delete("/delete/:skillId", auth, deleteSkill)

//UPDATE SKILL
router.put("/update/:skillId", auth, updateSkill)
module.exports = router