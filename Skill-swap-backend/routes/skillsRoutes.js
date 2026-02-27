const express = require("express")
const { getAllSkills,  getSkillById} = require("../controllers/skillController")

const router = express.Router()

// GET ALL SKILLS
router.get("/", getAllSkills)

// GET SINGLE SKILL BY ID
router.get("/:id", getSkillById)

module.exports = router