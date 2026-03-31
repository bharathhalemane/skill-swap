const Skill = require("../models/Skill")
const cloudinary = require("../config/cloudinary")
const mongoose = require("mongoose")

exports.getAllSkills = async (req, res) => {
    try {
        const { category, level, title, page = 1, limit = 8 } = req.query

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

        const skip = (page - 1) * limit
        const skills = await Skill.find(filter)
            .populate("user", "name profile.profile_image _id")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))

        const totalSkills = await Skill.countDocuments(filter)

        res.status(200).json({ skills, totalSkills })
    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

exports.getSkillById = async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.skillId)
            .populate("user", "name profile.profile_image _id")

        if (!skill) {
            return res.status(404).json({ message: "skill not found" })
        }

        res.status(200).json(skill)
    } catch (error) {
        res.status(500).json({ message: "Server Error", error })
    }
}

exports.getSkillsOfOwner = async (req, res) => {
    try {
        const { userId } = req.params
        const skills = await Skill.find({ user: userId })
            .populate("user", "name profile.profile_image _id")
            .sort({ createdAt: -1 })

        if (!skills || skills.length === 0) {
            return res.status(404).json({ msg: "No Skills found" })
        }

        res.status(200).json({
            count: skills.length,
            skills
        })

    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getSkillsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 4 } = req.query

        const skip = (page - 1) * limit

        const skills = await Skill.find({ user: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

        const formattedSkills = skills.map(skill => ({
            id: skill._id,
            title: skill.title,
            description: skill.description,
            imageUrl: skill.imageUrl,
            category: skill.category,
            level: skill.level
        }));

        const totalSkills = await Skill.countDocuments({ user: userId })

        res.status(200).json({
            success: true,
            count: formattedSkills.length,
            skills: formattedSkills,
            totalSkills
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
            return res.status(400).json({ error: "fill all requirements fields" })
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
                                { quality: "auto" }
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
    } catch (error) {
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

        if (skill.user.toString() !== req.user.userId) {

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
        const { skillId } = req.params

        const skill = await Skill.findById(skillId)

        const skillUser = skill.user.toString()
        const tokenUser = req.user.userId.toString()


        if (skillUser !== tokenUser) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this skill"
            })
        }

        if (!skill) {
            res.status(404).json({
                success: false,
                message: "Skill not found"
            })
        }

        if (skillUser !== tokenUser) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this skill"
            })
        }

        const { title, description, category, level, imageUrl } = req.body || {}

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
        console.log(error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.getFourSkills = async (req, res) => {
    try {
        const userId = req.user.userId

        const skills = await Skill.aggregate([
            {
                $match: {
                    user: { $ne: new mongoose.Types.ObjectId(userId) }
                }
            },
            {
                $sample: { size: 4 }
            },
            {
                $lookup: {
                    from: "users", // collection name in MongoDB
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $project: {
                    id: "$_id",
                    title: 1,
                    imageUrl: 1,
                    category: 1,
                    level: 1,
                    description: 1,

                    user: {
                        userId: "$user._id",
                        name: "$user.name",
                        profileImage: "$user.profile.profile_image",
                        profile: "$user.profile"
                    }
                }
            }
        ])

        res.status(200).json({
            success: true,
            data: skills
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

exports.getCategoryWiseSkillCount = async (req, res) => {
    try {
        const categories = [
            "Academics",
            "Technology",
            "Wellness",
            "Music",
            "Design",
            "Languages",
            "Career",
        ]

        const result = await Skill.aggregate([
            {
                $group: {
                    _id: {
                        $cond: [
                            { $in: ["$category", categories] },
                            "$category",
                            "Other"
                        ]
                    },
                    count: { $sum: 1 }
                }
            }
        ])

        const countMap = {}
        result.forEach(item => {
            countMap[item._id] = item.count
        })

        const finalCategories = [...categories, "Others"]

        const finalData = finalCategories.map(cat => ({
            category: cat,
            count: countMap[cat] || 0
        }))
        res.status(200).json({
            success: true,
            data: finalData
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

