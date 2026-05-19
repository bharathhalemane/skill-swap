const express = require("express")
const { createGroup, getAllGroups, searchGroups, sendJoinRequest, acceptJoinRequest, rejectJoinRequest, getJoinRequests, leaveGroup } = require("../controllers/groupController")

const auth = require("../middleWare/auth")

const router = express.Router()

router.post("/create", auth, createGroup);
router.get("/", getAllGroups)
router.get("/search", searchGroups)
router.post("/:groupId/request", auth, sendJoinRequest)
router.post("/:groupId/accept/:userId", auth, acceptJoinRequest)
router.post("/:groupId/reject/:userId", auth, rejectJoinRequest)
router.get("/:groupId/requests", auth, getJoinRequests)
router.put("/leave-group/:groupId", auth, leaveGroup)

module.exports = router
