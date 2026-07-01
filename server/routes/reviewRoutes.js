const express = require("express")

const { submitReview, getTeacherReviews, checkReviewed } = require("../controllers/reviewController")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/submit", auth, submitReview)
router.get("/teacher/:teacherId", getTeacherReviews)
router.get("/check/:requestId", auth, checkReviewed)

module.exports = router