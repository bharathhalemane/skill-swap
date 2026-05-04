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
            host: req.user.id,
            members: [req.user.id],
        });

        await group.save();

        res.status(201).json({
            success: true,
            message: "Group created Successfully",
            data : group,
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error!" })
    }
}

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find()
            .populate("host", "name")
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



