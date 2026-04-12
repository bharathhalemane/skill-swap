const express = require("express")
const auth = require("../middleware/auth")
const {addAvailability, getAvailabilities, deleteAvailabilitySlot, deleteAllDaySlots, getAvailabilitiesByUser} = require("../controllers/availabilityController")


const router = express.Router()

router.post("/create/", auth, addAvailability)
router.get("/my", auth, getAvailabilities)
router.delete("/delete/:slotId", auth, deleteAvailabilitySlot)
router.delete("/delete/all/:dayId", auth, deleteAllDaySlots)
router.get("/owner/availabilities/:userId", getAvailabilitiesByUser)

module.exports = router