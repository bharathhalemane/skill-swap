const express = require("express")
const auth = require("../middleware/auth")
const {addAvailability, getAvailabilities, deleteAvailabilitySlot, deleteAllDaySlots} = require("../controllers/availabilityController")


const router = express.Router()

router.post("/create/", auth, addAvailability)
router.get("/my", auth, getAvailabilities)
router.delete("/delete/:slotId", auth, deleteAvailabilitySlot)
router.delete("/delete/all/:dayId", auth, deleteAllDaySlots)

module.exports = router