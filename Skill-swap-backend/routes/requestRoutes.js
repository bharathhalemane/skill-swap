const express = require("express")
const {sendRequest, getReceivedRequests, getSentRequests, acceptRequest, rejectRequest, cancelRequest} = require("../controllers/requestController")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/send", auth, sendRequest)
router.get("/received", auth, getReceivedRequests)
router.get("/sent", auth, getSentRequests)
router.put("/accept/:id", auth, acceptRequest)
router.put("/reject/:id", auth, rejectRequest)
router.delete("/cancel/:id", auth, cancelRequest);


module.exports = router