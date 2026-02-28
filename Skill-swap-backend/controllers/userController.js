const User = require("../models/User")
const cloudinary = require("../config/cloudinary")

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId

        const {
            name,
            userName,
            location,
            bio
        } = req.body


        const user = await User.findById(userId)

        if (!user) {
            return res.status(404).json({ message: "User not Found" })
        }

        let imageUrl

        if (req.file) {
            const uploadToCloudinary = () => {
                return new promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: "skill-swap/profile-images",
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

         const updateData = {}

        if (name) updateData.name = name
        if (userName) updateData["profile.userName"] = userName
        if (location) updateData["profile.location"] = location
        if (bio) updateData["profile.bio"] = bio
        if (imageUrl) updateData["profile.profileImage"] = imageUrl

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        )

        res.status(200).json({
            message: "profile updated Successfully", user: updatedUser
        })
    } catch (error) {
        res.status(500).json({
            message: "server error",
            error: error.message
        })
    }
}