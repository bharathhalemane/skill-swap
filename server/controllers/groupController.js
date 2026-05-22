const Group = require("../models/Group")
const { getIO, onlineUsers } = require("../socket.js")

exports.createGroup = async (req, res) => {
    try {
        const { title, description, mode, location, maxMembers, joinLink, date, time } = req.body;

        if (mode === "online" && !joinLink) {
            return res.status(400).json({
                message: "Join link is required for online groups"
            })
        }

        if (mode === "offline" && !location) {
            return res.status(400).json({
                message: "Location is required for offline groups"
            })
        }

        const group = new Group({
            title,
            description,
            mode,
            location,
            joinLink,
            date,
            time,
            maxMembers,
            host: req.user.userId,
            members: [req.user.userId],
        });

        await group.save();

        res.status(201).json({
            success: true,
            message: "Group created Successfully",
            data: group,
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error!" })
    }
}

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find()
            .populate("host", "name profile")
            .sort({ createdAt: -1 });

        const updatedGroups = groups.map(group => ({
            ...group.toObject(),
            membersCount: group.members.length
        }));

        res.status(200).json({
            data: updatedGroups
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.getGroupById = async (req, res) => {
    try {
        const { groupId } = req.params

        const group = await Group.findById(groupId)
            .populate("host", "name profile.profile_image email phoneNumber")
            .populate("members.user", "name profile.profile_image email phoneNumber")

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            })
        }

        const updatedGroup = {
            ...group.toObject(),
            membersCount: group.members.length
        }

        res.status(200).json({
            data: updatedGroup
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.searchGroups = async (req, res) => {
    try {
        const { query } = req.query
        const groups = await Group.find({
            $or: [
                {
                    title: {
                        $regex: query,
                        $option: "i"
                    }
                },
                {
                    description: {
                        $regex: query,
                        $options: "i"
                    }
                }
            ]
        })
            .populate("host", "name profile")
            .sort({ createdAt: -1 });
        const updatedGroups = groups.map(group => ({
            ...group.toObject(),
            membersCount: group.members.length
        }));

        res.status(200).json({
            data: updatedGroups
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.sendJoinRequest = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const userId = req.user.userId

        const group = await Group.findById(groupId)

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            })
        }

        const alreadyMember = group.members.some(
            member => member.toString() === userId
        )

        if (alreadyMember) {
            return res.status(400).json({
                message: "Already a member"
            })
        }

        const alreadyRequested = group.joinRequests.some(
            request => request.user.toString() === userId
        )

        if (alreadyRequested) {
            return res.status(400).json({
                message: "Request already sent"
            })
        }

        if (group.members.length >= group.maxMembers) {
            return res.status(400).json({
                message: "Group is full"
            })
        }

        group.joinRequests.push({
            user: userId,
            requestedAt: new Date()
        })

        await group.save()

        const io = getIO()
        const ownerId = group.host.toString()
        const ownerSocketId = onlineUsers[ownerId]
        if (ownerSocketId) {
            io.to(ownerSocketId).emit("new_group_join_request")
            io.to(ownerSocketId).emit("new_group_join_get_request")
        }

        res.status(200).json({
            message: "join request sent successfully"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.acceptJoinRequest = async (req, res) => {
    try {
        const { groupId, userId } = req.params
        const group = await Group.findById(groupId)

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            })
        }

        if (group.host.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Access denied"
            })
        }

        if (group.members.length >= group.maxMembers) {
            return res.status(400).json({
                message: "Group is full"
            })
        }

        group.joinRequests = group.joinRequests.filter(
            request => request.user.toString() !== userId
        )

        group.members.push(userId)

        await group.save()

        const senderSocketId = onlineUsers[userId]
        const io = getIO()
        if (senderSocketId) {
            io.to(senderSocketId).emit("request_accepted")
        }

        res.status(200).json({
            message: "Request accepted"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.rejectJoinRequest = async (req, res) => {
    try {
        const { groupId, userId } = req.params
        const group = await Group.findById(groupId)

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            })
        }

        if (group.host.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Access Denied"
            })
        }

        group.joinRequests = group.joinRequests.filter(
            requests => requests.user.toString() !== userId
        )

        await group.save()

        const senderSocketId = onlineUsers[userId]
        const io = getIO()
        if (senderSocketId) {
            io.to(senderSocketId).emit("request_rejected")
        }

        res.status(200).json({
            message: "Request rejected"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params

        const group = await Group.findById(groupId)

        if (!group) {
            return res.status(404).json({
                message: "Group Not Found"
            })
        }

        if (group.host.toString() === req.user.userId) {
            return res.status(400).json({
                message: "Host cannot leave the group"
            })
        }

        const isMember = group.members.some(
            member => member.toString() === req.user.userId
        )

        if (!isMember) {
            return res.status(400).json({
                message: "You are not a member of this group"
            })
        }

        group.members = group.members.filter(
            member => member.toString() !== req.user.userId
        )

        await group.save()

        const io = getIO()
        const hostSocketId = onlineUsers[group.host.toString()]
        if (hostSocketId) {
            io.to(hostSocketId).emit("member_left_group")
        }

        res.status(200).json({
            message: "Left group successfully"
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message
        })
    }
}


exports.getJoinRequests = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const userId = req.user.userId

        const group = await Group.findById(groupId)
            .populate("joinRequests.user", "name profile")

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            })
        }

        if (group.host.toString() !== userId) {
            return res.status(403).json({
                message: "Access denied"
            })
        }

        res.status(200).json({
            data: group.joinRequests
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.updateBriefDescription = async (req, res) => {
    try {
        const { groupId } = req.params
        const { briefDescription } = req.body

        const group = await Group.findById(groupId)

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            })
        }

        if (group.host.toString() !== req.user.userId) {
            return res.status(403).json({
                message: "Only host can edit"
            })
        }

        group.briefDescription = briefDescription

        await group.save()

        res.status(200).json({
            message: "Brief description updated",
            group
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.updateCoverPoints = async (req, res) => {
    try {
        const { groupId } = req.params
        const { coverPoints } = req.body 

        const group = await Group.findById(groupId)

        if (!group) {
            return res.status(404).json({
                message: "Group not found"
            })
        }

        if(group.host.toString() !== req.user.userId){
            return res.status(403).json({
                message: "Only host can edit"
            })
        }

        group.coverPoints = coverPoints 

        await group.save() 

        res.status(200).json({
            message: "Cover points updated",
            group
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}