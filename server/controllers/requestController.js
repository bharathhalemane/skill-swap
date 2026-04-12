const Request = require("../models/Request.js")
const Skill = require("../models/Skill.js")
const { getIO, onlineUsers } = require("../socket.js")

exports.sendRequest = async (req, res) => {
    try {
        const { skillId, message, swapSkillId, isSwap } = req.body

        const skill = await Skill.findById(skillId).populate("user")


        if (!skill) {
            return res.status(404).json({ msg: "Skill not found" })
        }

        if (skill.user.toString() === req.user.userId) {
            return res.status(400).json({ msg: "You cannot request your own skill" })
        }

        const exists = await Request.findOne({
            skill: skillId,
            status: "PENDING",
            $or: [
                {
                    sender: req.user.userId,
                    receiver: skill.user
                },
                {
                    sender: skill.user,
                    receiver: req.user.userId
                }
            ]
        })

        if (exists) {
            return res.status(400).json({ msg: "Already requested" })
        }

        let swapSkill = null
        if (isSwap) {
            swapSkill = await Skill.findById(swapSkillId)

            if (!swapSkill) {
                return res.status(404).json({ msg: "Swap skill not found" })
            }

            if (swapSkill.user.toString() !== req.user.userId) {
                return res.status(403).json({ msg: "Invalid swap skill" })
            }
        }

        const request = await Request.create({
            skill: skillId,
            sender: req.user.userId,
            receiver: skill.user,
            swapSkill: isSwap ? swapSkillId : null,
            message,
            isSwap,
            status: "PENDING"
        })

        const populatedRequest = await Request.findById(request._id)
            .populate("sender", "name profile")
            .populate("skill", "title category")
            .populate("swapSkill", "title category")
        const msg = `New Skill swap request from ${populatedRequest.sender.name}`
        const io = getIO()
        const receiverId = skill.user._id.toString()
        const receiverSocketId = onlineUsers[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new_request", populatedRequest, msg)
        }

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

        if (!["REJECTED", "CANCELLED"].includes(request.status)) {
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

        const populatedRequest = await Request.findById(requestId)
            .populate("sender", "name profile")
            .populate("skill", "title category")
            .populate("swapSkill", "title category")
        const msg = `Request resent from ${populatedRequest.sender.name}`
        const io = getIO()
        const receiverId = request.receiver.toString()
        const receiverSocketId = onlineUsers[receiverId]
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new_request", populatedRequest, msg)
        }

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
            .populate("swapSkill", "title category")
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

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const requests = await Request.find({
            sender: req.user.userId,
            $or: [
                { status: "PENDING" },
                {
                    status: { $ne: "PENDING" },
                    updatedAt: { $gte: startOfDay, $lte: endOfDay }
                }
            ]
        })
            .populate("receiver", "name email profile")
            .populate("skill", "title category")
            .populate("swapSkill", "title category")
            .sort({ createdAt: -1 })
        res.json(requests)
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.acceptRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate("skill", "title")
            .populate("receiver", "name")
            .populate("sender", "name")

        if (!request) {
            return res.status(404).json({ msg: "Request not found" })
        }

        if (request.receiver._id.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "Unauthorized" })
        }

        request.status = "ACCEPTED"
        request.isLearning = true
        request.updatedAt = new Date()
        await request.save()

        const io = getIO()
        const senderSocketId = onlineUsers[request.sender._id.toString()]
        const msg = `Your request for ${request.skill.title} was accepted by ${request.receiver.name}`
        if (senderSocketId) {
            io.to(senderSocketId).emit("request_accepted", msg)
        }

        res.json({ msg: "Request accepted", request })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.rejectRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate("receiver", "name")
            .populate("sender", "name")
            .populate("skill", "title")

        if (!request) {
            return res.status(404).json({ msg: "Request not found" })
        }

        if (request.receiver._id.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "Unauthorized" })
        }

        request.status = "REJECTED"
        await request.save()

        const io = getIO()
        const senderSocketId = onlineUsers[request.sender._id.toString()]
        const msg = `Your request for ${request.skill.title} was rejected by ${request.receiver.name}`
        if (senderSocketId) {
            io.to(senderSocketId).emit("request_rejected", msg)
        }

        res.json({ msg: "request rejected", request })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.cancelRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate("sender", "name")
            .populate("skill", "title")

        if (!request) {
            return res.status(404).json({ msg: "Request not found" })
        }

        if (request.sender._id.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "only sender can cancel this request" })
        }

        if (request.status === "ACCEPTED") {
            return res.status(400).json({ msg: "cannot cancel accepted request" })
        }

        request.status = "CANCELLED";
        await request.save();

        const msg = `${request.skill.title} Request cancelled by ${request.sender.name}`;
        const io = getIO()
        const receiverSocketId = onlineUsers[request.receiver.toString()];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("request_cancelled", request, msg);
        }


        res.json({ msg: "Request cancelled successfully" })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getCurrentLearning = async (req, res) => {
    try {
        const userId = req.user.userId
        const learning = await Request.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ],
            status: "ACCEPTED",
            isLearning: true
        })
            .populate("sender", "name profile")
            .populate("receiver", "name profile")
            .populate("skill", "title category imageUrl")
            .populate("swapSkill", "title category imageUrl")

        const formatted = learning.map(reqItem => {
            const isSender = reqItem.sender._id.toString() === userId
            const isReceiver = reqItem.receiver._id.toString() === userId

            if (!reqItem.isSwap) {
                if (isSender) {
                    return {
                        id: reqItem._id,
                        skill: reqItem.skill,
                        partner: reqItem.receiver,
                        startedAt: reqItem.updatedAt
                    }
                }
                return null
            }

            if (reqItem.isSwap) {
                if (isSender) {
                    return {
                        id: reqItem._id,
                        skill: reqItem.skill,
                        partner: reqItem.receiver,
                        startedAt: reqItem.updatedAt
                    }
                }

                if (isReceiver) {
                    return {
                        id: reqItem._id,
                        skill: reqItem.swapSkill,
                        partner: reqItem.sender,
                        startedAt: reqItem.updatedAt
                    }
                }
            }
            return null
        }).filter(Boolean)

        res.json({
            success: true,
            count: formatted.length,
            data: formatted
        })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.endLearning = async (req, res) => {
    try {
        const { requestId } = req.params
        const userId = req.user.userId

        const request = await Request.findById(requestId)

        if (!request) {
            return res.status(404).json({ msg: "Request not found" })
        }

        if (
            request.sender.toString() !== userId && request.receiver.toString() !== userId
        ) {
            return res.status(403).json({ msg: "Unauthorized" })
        }

        request.status = "COMPLETED"
        request.isLearning = false
        request.updatedAt = new Date()

        await request.save()

        res.json({
            success: true,
            msg: "Learning completed",
            data: request
        })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getCompletedSkills = async (req, res) => {
    try {
        const userId = req.user.userId

        const completedRequests = await Request.find({
            status: "COMPLETED",
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        })
            .populate("skill", "title category imageUrl")
            .populate("swapSkill", "title category imageUrl")
            .populate("sender", "name")
            .populate("receiver", "name")
            .sort({ updatedAr: -1 })

        const learned = [];
        const taught = []
        const swaps = []

        completedRequests.forEach(reqItem => {
            const isSender = reqItem.sender._id.toString() == userId;

            if (reqItem.isSwap) {
                swaps.push(reqItem)
            } else if (isSender) {
                learned.push(reqItem)
            } else {
                taught.push(reqItem)
            }
        })

        res.status(200).json({
            success: true,
            data: {
                learned,
                taught,
                swaps
            }
        })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}