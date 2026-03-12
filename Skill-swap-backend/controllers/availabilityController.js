const Availability = require("../models/Availability")

exports.addAvailability = async (req, res) => {
    const { day, startTime } = req.body

    let availability = await Availability.findOne({
        user: req.user.userId,
        day
    })



    if (!availability) {
        availability = await Availability.create({
            user: req.user.userId,
            day,
            slots: [{ startTime }]
        })
    } else {
        availability.slots.push({ startTime })
        await availability.save()
    }
    const userTotalSlot = await Availability.find({ user: req.user.userId })
    res.json(userTotalSlot)
}

exports.getAvailabilities = async (req, res) => {
    const data = await Availability.find({
        user: req.user.userId
    })

    res.json(data)
}

exports.deleteAvailabilitySlot = async (req, res) => {
    try {
        const { slotId } = req.params
        const availability = await Availability.findOne({
            user: req.user.userId,
            "slots._id": slotId
        }
        )

        if (!availability) {
            return res.status(404).json({ message: "Slot not found" })
        }

        availability.slots = availability.slots.filter(
            slot => slot._id.toString() !== slotId
        )
        await availability.save()
        const userTotalSlots = await Availability.find({
            user: req.user.userId
        })
        res.json(userTotalSlots)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.deleteAllDaySlots = async (req, res) => {
    try {
        const { dayId } = req.params
        let availability = await Availability.findOneAndDelete({
            _id: dayId,
            user: req.user.userId
        })
        if (!availability) {
            return res.status(404).json({ message: "No availability found for this day" })
        }
        const userTotalSlots = await Availability.find({
            user: req.user.userId
        })
        res.json(userTotalSlots)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}