const express = require("express")

const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead
} = require("../controllers/notificationController")
const auth = require("../middleware/auth")

const router = express.Router() 

router.get("/", auth, getNotifications)
router.get("/unread-count", auth, getUnreadCount)
router.put("/:id/read", auth, markAsRead)
router.put("/read-all", auth, markAllAsRead)

module.exports = router