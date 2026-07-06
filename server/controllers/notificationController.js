const Notification = require('../models/Notification');
const { getIO, onlineUsers } = require('../socket');

exports.createNotification = async ({ recipient, sender, type, message, link, relatedId }) => {
    try {
        const notification = new Notification.create({ recipient, sender, type, message, link, relatedId });
       
        const io = getIO()
        const recipientSocketId = onlineUsers[recipient.toString()]

        if (io && recipientSocketId) {
            const unreadCount = await Notification.countDocuments({
                recipient, read: false
            })
            io.to(recipientSocketId).emit('notification:new', {
                notification, unreadCount
            })
        }

        return notification
    } catch (error) {
        console.log("createNotification error: ", error.message)
        return null
    }
}

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.userId
        const limit = parseInt(req.query.limit) || 30 

        const notifications = await Notification.find({ recipient: userId })
        .populate("sender", "name profile")
            .sort({ createdAt: -1 })
            .limit(limit)
        
        res.json({success: true, count: notifications.length, data: notifications})
    }catch(err){
        res.status(500).json({
            msg: err.message
        })

    }
}

exports.getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.userId 
        const unreadCount = await Notification.countDocuments({
            recipient: userId, read: false 
        })

        res.json({success: true, unreadCount})
    } catch (err) {
        res.status(500).json({
            msg: err.message
        })
    }
}

exports.markAsRead = async (req, res) => {
    try {
        const userId = req.user.userId 
        const notification = await Notification.findONe({ _id: req.params.id, recipient: userId }) 
        
        if (!notification) {
            return res.status(404).json({
                msg: "Notification not found"
            })
        }

        notification.read = true 
        await notification.save() 
        
        const unreadCount = await Notification.countDocuments({
            recipient: userId, read:false 
        })
        res.json({success: true, data: notification, unreadCount})
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

exports.markAllAsRead = async (req, res) => {
    try{
        const userId = req.user.userId 
        await Notification.updateMany({
            recipient: userId, read: false
        }, {$set: {read: true}}
        )
        res.json({success: true, unreadCount: 0})
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}