const ClassSchedule = require("../models/ClassSchedule")

exports.addClass = async (req, res) => {
    const { title, day, startTime, endTime } = req.body
    const newClass = await ClassSchedule.create({
        user: req.user.userId,
        title,
        day,
        startTime,
        endTime
    })

    res.json(newClass)
}

exports.getClasses = async (req, res) => {
    
    const classes = await ClassSchedule.find({
        user: req.user.userId 
    })

    res.json(classes)
}

exports.deleteClasses = async (req, res) => {
    console.log(req.params.id)
    await ClassSchedule.findByIdAndDelete(req.params.id)

    res.json({message : "Class Removed"})
}