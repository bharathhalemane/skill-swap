const Skill = require("../models/Skill")

exports.getAllSkills = async (req, res) => {
    try {
        const { category } = req.query
    
        let filter = {}
        if (category) {
          filter.category = category
        }
    
        const skills = await Skill.find(filter)    
        res.status(200).json(skills)
      } catch (error) {
        res.status(500).json({ message: "Server Error", error })
      }
}

exports.getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id) 

        if (!skill) {
            return res.status(404).json({message: "skill not found"})
        }

        res.status(200).json(skill)
    } catch (error) {
        res.status(500).json({message: "Server Error", error})
    }
}