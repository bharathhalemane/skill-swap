const Availability = require("../models/Availability")

exports.addAvailability = async (req, res) => {
    const { day, startTime } = req.body 

    let availability = await Availability.findOne({
        user : req.user.userId,
        day
    })

    if (!availability) {
        availability = await Availability.create({
            user: req.user.userId,
            day,
            slots : [{startTime}]
        })
    } else {
        availability.slots.push({ startTime })
        await availability.save()
    }

    res.json(availability)
}

exports.getAvailabilities = async (req, res) => {
    const data = await Availability.find({
        user: req.user.userId
    })

    res.json(data)
}

exports.deleteAvailabilitySlot = async (req, res) => {
    const { day, time } = req.params 
    const availability = await Availability.findOne({
        user: req.user.userId,
        day
    })

    availability.slots = availability.slots.filter(
        slot => slot.startTime !== time
    )

    await availability.save()

    res.json(availability)
}