const Request = require("../models/Request.js")
const Skill = require("../models/Skill.js")

exports.sendRequest = async (req, res) => {
    try {
        const { skillId, message } = req.body

        const skill = await Skill.findById(skillId)


        if (!skill) {
            return res.status(404).json({ msg: "Skill not found" })
        }

        if (skill.user.toString() === req.user.userId) {
            return res.status(400).json({ msg: "You cannot request your own skill" })
        }

        const exists = await Request.findOne({
            skill: skillId,
            sender: req.user.userId,
            status: "PENDING"
        })

        if (exists) {
            return res.status(400).json({ msg: "Already requested" })
        }

        const request = await Request.create({
            skill: skillId,
            sender: req.user.userId,
            receiver: skill.user,
            message,
            status: "PENDING"
        })

        res.status(201).json({
            success: true,
            data: request
        })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.resendRequest = async (req, res) => {
    try {
        const { requestId } = req.params
        const userId = req.user.userId

        const request = await Request.findById(requestId)

        if (!request) {
            return res.status(404).json({ msg: "Request not found" })
        }

        if (request.sender.toString() !== userId) {
            return res.status(403).json({ msg: "Unauthorized" })
        }

        if (!["REJECTED", "CANCELED"].includes(request.status)) {
            return res.status(400).json({ msg: "Cannot resend this request" })
        }

        const exists = await Request.findOne({
            skill: request.skill,
            sender: userId,
            status: "PENDING"
        })

        if (exists) {
            return res.status(400).json({ msg: "Already have a pending request" })
        }

        request.status = "PENDING"
        request.updatedAt = new Date()

        await request.save()

        res.json({
            success: true,
            msg: "Request resent successfully",
            data: request
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: err.message })
        
    }
}

exports.getReceivedRequests = async (req, res) => {
    try {
        const ownerId = req.user.userId

        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const endOfDay = new Date()
        endOfDay.setHours(23, 59, 59, 999)

        const requests = await Request.find({
            receiver: ownerId,
            $or: [
                { status: "PENDING" },
                {
                    status: { $in: ["ACCEPTED", "REJECTED", "CANCELED"] },
                    updatedAt: { $gte: startOfDay, $lte: endOfDay }
                }
            ]
        })
            .populate("sender", "name profile")
            .populate("skill", "title category")
            .sort({
                status: 1,
                createdAt: -1
            })

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getSentRequests = async (req, res) => {
    try {
        const requests = await Request.find({
            sender: req.user.userId
        })
            .populate("receiver", "name email profile")
            .populate("skill", "title category")

        res.json(requests)
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.acceptRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)

        if (!request) {
            return res.status(404).json({ msg: "Request not found" })
        }

        if (request.receiver.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "Unauthorized" })
        }

        request.status = "ACCEPTED"
        request.isLearning = true
        request.updatedAt = new Date()
        await request.save()

        res.json({ msg: "Request accepted", request })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.rejectRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ msg: "Request not found" })
        }

        if (request.receiver.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "Unauthorized" })
        }

        request.status = "REJECTED"
        await request.save()

        res.json({ msg: "request rejected", request })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.cancelRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)

        if (!request) {
            return res.status(404).json({ msg: "Request not found" })
        }

        if (request.sender.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "only sender can cancel this request" })
        }

        if (request.status === "ACCEPTED") {
            return res.status(400).json({ msg: "cannot cancel accepted request" })
        }

        request.status = "CANCELLED";
        await request.save();

        res.json({ msg: "Request cancelled successfully" })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getCurrentLearning = async (req, res) => {
    try {
        const userId = req.user.userId
        const learning = await Request.find({
            sender: userId,
            status: "ACCEPTED",
            isLearning: true
        })
            .populate("sender", "name profile")
            .populate("receiver", "name profile")
            .populate("skill", "title category")

        res.json({
            success: true,
            count: learning.length,
            data: learning
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: err.message })
    }
}