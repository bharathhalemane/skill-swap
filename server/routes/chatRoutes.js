const express = require("express")

const {
    getOrCreateConversation,
    getConversations,
    getMessages,
    sendMessage,
    markRead,
    getUnreadTotal
} = require("../controllers/chatController")
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/conversations", auth, getConversations)
router.get("/unread-count", auth, getUnreadTotal)
router.get("/request/:requestId", auth, getOrCreateConversation)
router.get("/:conversationId/messages", auth, getMessages)
router.post("/:conversationId/messages", auth, sendMessage)
router.put("/:conversationId/read", auth, markRead)

module.exports = router