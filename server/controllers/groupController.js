const Group = require("../models/Group")

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
        const groupId = req.params.id
        const userId = req.user.userId

        const group = await Group.findById(groupId)

        if (!groupId) {
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
            requests => request.toString() === userId
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

        group.joinRequests.push(userId)

        await group.save()

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
        const { id, userId } = req.params
        const group = await Group.findById(id)

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
            request => request.toString() !== userId
        )

        group.members.push(userId)

        await group.save()

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
        const { id, userId } = req.params
        const group = await Group.findById(id)

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
            requests => requests.toString() !== userId
        )

        await group.save()

        res.status(200).json({
            message: "Request rejected"
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.getJoinRequests = async (req, res) => {
    try {
        const groupId = req.params.id
        const userId = req.user.userId

        const group = await Group.findById(groupId)
            .populate("joinRequests", "name profile")

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