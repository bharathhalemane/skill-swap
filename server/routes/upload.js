const express = require("express")
const cloudinary = require("../config/cloudinary")
const upload = require("../middleware/upload")

const router = express.Router()

router.post("/img", upload.single("image"), async (req, res) => {
    try {
        const file = req.file
        console.log(typeof upload)
        const result = await cloudinary.uploader.upload_stream(
            { folder: "skill-swap" },
            (error, result) => {
                if (error) {
                    return res.status(500).json({error})
                }

                res.status(200).json({
                    imageUrl: result.secure_url
                })
            }
        )

        result.end(file.buffer)
    } catch (err) {
        res.status(500).json({message: "Upload failed"})
    }
})

module.exports = router