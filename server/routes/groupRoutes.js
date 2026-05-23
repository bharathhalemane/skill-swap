const express = require("express")
const { createGroup, getAllGroups, searchGroups, sendJoinRequest, acceptJoinRequest, rejectJoinRequest, getJoinRequests, leaveGroup, getGroupById, updateBriefDescription, updateCoverPoints } = require("../controllers/groupController")

const auth = require("../middleware/auth")

const router = express.Router()

router.post("/create", auth, createGroup);
router.get("/", getAllGroups)
router.get("/search", searchGroups)
router.post("/:groupId/request", auth, sendJoinRequest)
router.post("/:groupId/accept/:userId", auth, acceptJoinRequest)
router.post("/:groupId/reject/:userId", auth, rejectJoinRequest)
router.get("/:groupId/requests", auth, getJoinRequests)
router.put("/leave-group/:groupId", auth, leaveGroup)
router.get("/:groupId", auth, getGroupById);
router.put("/:groupId/brief-description", auth, updateBriefDescription)
router.put("/:groupId/cover-points", auth, updateCoverPoints)

module.exports = router
