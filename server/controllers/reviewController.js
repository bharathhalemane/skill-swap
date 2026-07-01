const Review = require("../models/Review")
const Request = require("../models/Request")


exports.submitReview = async (req, res) => {
    try {
        const { requestId, rating, review } = req.body
        const reviewerId = req.user.userId

        if (!requestId || !rating || !review) {
            return res.status(400).json({ msg: "RequestId, rating, and review are required" })
        }

        const request = await Request.findById(requestId)
            .populate("skill")
            .populate("sender", "name")
            .populate("receiver", "name")

        if (!request) return res.status(404).json({ msg: "Request not found" })

        if (request.sender._id.toString() !== reviewerId) {
            return res.status(403).json({ msg: "Only the learner can submit a review" })
        }

        const teacherId = request.receiver._id

        const existing = await Review.findOne({ request: requestId, reviewer: reviewerId })
        if (existing) {
            return res.status(409).json({ msg: "You have already reviewed this session" })
        }

        const newReview = await Review.create({
            request: requestId,
            skill: request.skill._id,
            reviewer: reviewerId,
            teacher: teacherId,
            rating,
            review,
        })

        res.status(201).json({ success: true, data: newReview })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getTeacherReviews = async (req, res) => {
    try {
        const { teacherId } = req.params

        const reviews = await Review.find({ teacher: teacherId })
            .populate("reviewer", "name profile")
            .populate("skill", "title")
            .sort({ createdAt: -1 })

        const total = reviews.reduce((sum, r) => sum + r.rating, 0)
        const average = reviews.length ? +(total / reviews.length).toFixed(1) : 0

        res.json({ success: true, count: reviews.length, average, data: reviews })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.checkReviewed = async (req, res) => {
    try {
        const { requestId } = req.params
        const reviewerId = req.user.userId

        const existing = await Review.findOne({ request: requestId, reviewer: reviewerId })

        res.json({ reviewed: !!existing })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}