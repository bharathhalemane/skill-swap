const express = require("express")
const auth = require("../middleware/auth")
const {addAvailability, getAvailabilities, deleteAvailabilitySlot} = require("../controllers/availabilityController")


const router = express.Router()

router.post("/create/", auth, addAvailability)
router.get("/my", auth, getAvailabilities)
router.delete("/delete/:day/:time", auth, deleteAvailabilitySlot)

module.exports = router