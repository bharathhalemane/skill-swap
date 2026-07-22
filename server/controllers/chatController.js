const mongoose = require("mongoose")
const Conversation = require("../models/Conversation.js")
const Message = require("../models/Message.js")
const Request = require("../models/Request")
const { getIO, onlineUsers } = require("../socket")
const { createNotification } = require("./notificationController")

exports.getOrCreateConversation = async (req, res) => {
    try {
        const userId = req.user.userId
        const { requestId } = req.params

        const request = await Request.findById(requestId)
        if (!request) {
            return res.status(404).json({ msg: "request not found" })
        }

        const isParticipant = [request.sender.toString(), request.receiver.toString()].includes(userId)
        if (!isParticipant) {
            return res.status(403).json({ msg: "Unauthorized" })
        }

        if (request.status !== "ACCEPTED" && request.status !== "COMPLETED") {
            return res.status(400).json({ msg: "Chat unlocks once the request is accepted" })
        }

        let conversation = await Conversation.findOne({ requestId })

        if (!conversation) {
            conversation = await Conversation.create({
                requestId,
                participants: [request.sender, request.receiver]
            })
        }

        conversation = await conversation.populate("participants", "name profile")
        conversation = await conversation.populate({
            path: "requestId", populate: {
                path: "skill", select: "title"
            }
        })



        res.json({ success: true, data: conversation })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.userId

        const conversations = await Conversation.find({ participants: userId }).populate("participants", "name profile")
            .populate({ path: "requestId", select: "skill status", populate: { path: "skill", select: "title" } })
            .sort({ lastMessageAt: -1 })

        const withUnread = await Promise.all(conversations.map(async (conv) => {
            const unreadCount = await Message.countDocuments({
                conversationId: conv._id,
                sender: { $ne: userId },
                status: { $ne: "read" }
            })
            return { ...conv.toObject(), unreadCount }
        }))

        res.json({ success: true, data: withUnread })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getMessages = async (req, res) => {
    try {
        const userId = req.user.userId
        const { conversationId } = req.params
        const limit = parseInt(req.query.limit) || 30

        const conversation = await Conversation.findById(conversationId)
        if (!conversation) {
            return res.status(404).json({ msg: "Conversation not found" })
        }
        if (!conversation.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({ msg: "Unauthorized" })
        }

        const query = { conversationId }
        if (req.query.before) {
            const beforeMsg = await Message.findById(req.query.before)
            if (beforeMsg) query.createdAt = { $lt: beforeMsg.createdAt }
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate("sender", "name profile")

        res.json({ success: true, data: messages.reverse() })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const userId = req.user.userId
        const { conversationId } = req.params
        const { text } = req.body

        if (!text || !text.trim()) {
            return res.status(400).json({ msg: "Message text is required" })
        }

        const conversation = await Conversation.findById(conversationId)
        if (!conversation) {
            return res.status(404).json({ msg: "Conversation not found" })
        }
        if (!conversation.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({ msg: "Unauthorized" })
        }

        const recipientId = conversation.participants.find(p => p.toString() !== userId)
        const io = getIO()
        const recipientSocketId = onlineUsers[recipientId.toString()]

        const message = await Message.create({
            conversationId,
            sender: userId,
            text: text.trim(),
            status: recipientSocketId ? "delivered" : 'sent'
        })
        const currentUnread = conversation.unreadCount.get(recipientId.toString()) || 0;
        conversation.unreadCount.set(
            recipientId.toString(),
            currentUnread + 1
        );

        conversation.lastMessage = text.trim()
        conversation.lastMessageAt = new Date()
        conversation.lastMessageSender = userId
        await conversation.save()

        const populatedMessage = await message.populate("sender", "name profile")


        if (io && recipientSocketId) {
            io.to(recipientSocketId).emit("chat:message", {
                conversationId,
                message: populatedMessage
            })

            io.to(recipientSocketId).emit("chat:newConv", {
                conversationId
            });
        } else {
            await createNotification({
                recipient: recipientId,
                sender: userId,
                type: "NEW_MESSAGE",
                message: `New message: "${text.trim().slice(0, 60)}"`,
                link: `/chat/${conversationId}`,
                relatedId: conversationId
            })
        }

        res.json({ success: true, data: populatedMessage })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.markRead = async (req, res) => {
    try {
        const userId = req.user.userId
        const { conversationId } = req.params

        const conversation = await Conversation.findById(conversationId)
        if (!conversation) {
            return res.status(404).json({ msg: "Conversation not found" })
        }
        if (!conversation.participants.some(p => p.toString() === userId)) {
            return res.status(403).json({ msg: "Unauthorized" })
        }

        await Message.updateMany(
            { conversationId, sender: { $ne: userId }, status: { $ne: "read" } },
            { $set: { status: "read" } }
        )

        const senderId = conversation.participants.find(p => p.toString() !== userId)
        const io = getIO()
        const senderSocketId = onlineUsers[senderId.toString()]
        if (io && senderSocketId) {
            io.to(senderSocketId).emit("chat:read", { conversationId, readBy: userId })
        }
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}

exports.getUnreadTotal = async (req, res) => {
    try {
        const userId = req.user.userId
        const conversationIds = await Conversation.find({ participants: userId }).distinct("_id")

        const unreadCount = await Message.countDocuments({
            conversationId: { $in: conversationIds },
            sender: { $ne: userId },
            status: { $ne: "read" }
        })

        res.json({ success: true, unreadCount })
    } catch (err) {
        res.status(500).json({ msg: err.message })
    }
}