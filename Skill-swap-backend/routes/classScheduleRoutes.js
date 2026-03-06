const express = require("express")
const auth = require("../middleware/auth")

const router = express.Router()

const {addClass, getClasses, deleteClasses} = require("../controllers/classScheduleController")

router.post("/create/", auth, addClass)
router.get("/my", auth, getClasses)
router.delete("/delete/:id", auth, deleteClasses)

module.exports = router