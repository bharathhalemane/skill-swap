const Skill = require("../models/Skill")
const cloudinary = require("../config/cloudinary")

exports.getAllSkills = async (req, res) => {
    try {
        const { category, level, title } = req.query

        let filter = {}
        if (category) {
            filter.category = { $regex: category, $options: "i" }
        }

        if (level) {
            filter.level = { $regex: level, $options: 'i' }
        }

        if (title) {
            const words = title.trim().split(/\s+/)

            filter.$and = words.map(word => ({
                title: { $regex: word, $options: "i" }
            }))
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
            return res.status(404).json({ message: "skill not found" })
        }

        res.status(200).json(skill)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

exports.addSkill = async (req, res) => {
    try {
        const { title, category, description, duration, level } = req.body
        
        if (!title || !category || !description || !level) {
            return res.status(400).json({error: "fill all requirements fields"})
        }

        let imageUrl = "";

        if (req.file) {
            const uploadToCloudinary = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "skill-swap/skills",
                            transformation: [
                                {
                                    width: 500, height: 500, crop: "fill"
                                },
                                {quality: "auto"}
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error)
                            else resolve(result)
                        }
                    )

                    stream.end(req.file.buffer)
                })
            }
            const result = await uploadToCloudinary() 
            imageUrl = result.secure_url
        }

        const newSkill = await Skill.create({
            user: req.user.id,
            title,
            category,
            description,
            duration,
            level,
            imageUrl
        })

        res.status(201).json(newSkill)        
    }catch (error) {
        console.error("FULL ERROR OBJECT:", error);
        res.status(500).json({
            message: error.message,
            stack: error.stack
        });
    }
}