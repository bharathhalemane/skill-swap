const express = require("express")
const { sendRequest, getReceivedRequests, getCurrentLearning, getSentRequests, acceptRequest, rejectRequest, cancelRequest, resendRequest, endLearning, getCompletedSkills } = require("../controllers/requestController")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/send", auth, sendRequest)
router.get("/received", auth, getReceivedRequests)
router.get("/sent", auth, getSentRequests)
router.put("/accept/:id", auth, acceptRequest)
router.put("/reject/:id", auth, rejectRequest)
router.delete("/cancel/:id", auth, cancelRequest);
router.get("/learning", auth, getCurrentLearning)
router.patch("/resend/:requestId", auth, resendRequest)
router.get("/completed-skills", auth, getCompletedSkills)
router.patch("/end/:requestId", auth, endLearning)

module.exports = router