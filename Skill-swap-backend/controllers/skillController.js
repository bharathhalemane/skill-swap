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


        const skills = await Skill.find(filter).populate("user","name profile.profile_image").sort({createdAt: -1})

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


exports.getSkillsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const skills = await Skill.find({ user: userId })      
      .sort({ createdAt: -1 })
      .lean();

    // Optional: format clean response
    const formattedSkills = skills.map(skill => ({
      id: skill._id,
      title: skill.title,
      description: skill.description,
      imageUrl: skill.imageUrl,
      category: skill.category,
      level: skill.level      
    }));

    res.status(200).json({
      success: true,
      count: formattedSkills.length,
      skills: formattedSkills
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

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
                            folder: "skill-swap/skills-image",
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
            user: req.user.userId,
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

exports.deleteSkill = async (req, res) => {
    try {
        const { skillId } = req.params 
        
        const skill = await Skill.findById(skillId)

        if (!skill) {
            return res.status(400).json({
                success: false,
                message: "Skill not found"
            })
        }

        if (skill.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this skill"
            })
        }

        await skill.deleteOne();

        res.status(200).json({
            success: true,
            message: "Skill deleted successfully"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message,
            success: false
        })   
    }
}


exports.updateSkill = async (req, res) => {
    try {
        const {skillId} = req.params

        const skill = await Skill.findById(skillId)

        if(!skill){
            res.status(404).json({
                success: false,
                message: "Skill not found"
            })
        }

        if (skill.user.toString !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this skill"
            })
        }

        const {title, description, category, level, imageUrl} = req.body 

        skill.title = title ?? skill.title;
        skill.description = description ?? skill.description 
        skill.category = category ?? skill.category 
        skill.level = level ?? skill.level 
        skill.imageUrl = imageUrl ?? skill.imageUrl

        await skill.save() 

        res.status(200).json({
            success: true,
            message: "Skill updated successfully",
            skill
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}