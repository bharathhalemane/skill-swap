const Request = require("../models/Request.js")
const Skill = require("../models/Skill.js") 

exports.sendRequest = async(req, res) => {
    try {
        const { skillId, message } = req.body

        const skill = await Skill.findById(skillId)
        

        if (!skill) {
            return res.status(404).json({ msg: "Skill not found" })
        }

        if (skill.user.toString() === req.user.userId) {
            return res.status(400).json({msg: "You cannot request your own skill"})
        }

        const exists = await Request.findOne({
            skill: skillId,
            sender: req.user.userId
        })

        if (exists) {
            return res.status(400).json({ msg: "Already requested" })
        }

        const request = await Request.create({
            skill: skillId,
            sender: req.user.userId,
            receiver: skill.user,
            message
        })

        res.json(request)        

    }catch(err){
        res.status(500).json({ msg: err.message })
        console.log(err)
    }
}

exports.getReceivedRequests = async(req, res) => {
    try {
        const requests = await Request.find({
            receiver: req.user.userId
        })
            .populate("sender", "name email profile.profile_image")
            .populate("skill","title")
        
        res.json(requests);
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

exports.getSentRequests = async (req, res) => {
    try {
        const requests = await Request.find({
            sender: req.user.userId
        })
        .populate("receiver", "name email profile.profile_image")
            .populate("skill", "title")
        
        res.json(requests)
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

exports.acceptRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)

        if (!request) {
            return res.status(404).json({msg: "Request not found"})
        }

        if (request.receiver.toString() !== req.user.userId) {
            return res.status(403).json({msg: "Unauthorized"})
        }

        request.status = "ACCEPTED"
        await request.save()

        res.json({msg: "Request accepted", request})
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}

exports.rejectRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({msg: "Request not found"})
        }

        if (request.receiver.toString() !== req.user.userId) {
            return res.status(403).json({msg: "Unauthorized"})
        }

        request.status = "REJECTED"
        await request.save()

        res.json({msg: "request rejected" , request})
    }catch(err){
        res.status(500).json({msg: err.message})
    }
}

exports.cancelRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)

        if (!request) {
            return res.status(404).json({msg : "Request not found"})
        }

        if (request.sender.toString() !== req.user.userId) {
            return res.status(403).json({ msg: "only sender can cancel this request" })
        }

        if (request.status === "ACCEPTED") {
            return res.status(400).json({msg: "cannot cancel accepted request"})
        }

        request.status = "CANCELLED";
        await request.save();

        res.json({msg: "Request cancelled successfully"})
    } catch (err) {
        res.status(500).json({msg: err.message})
    }
}