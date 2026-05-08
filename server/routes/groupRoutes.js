const express = require("express")
const { createGroup, getAllGroups, searchGroups, sendJoinRequest, acceptJoinRequest, rejectJoinRequest, getJoinRequests } = require("../controllers/groupController")
const auth = require("../middleWare/auth")

const router = express.Router()

router.post("/create", auth, createGroup);
router.get("/", getAllGroups)
router.get("/search", searchGroups)
router.post("/:id/request", auth, sendJoinRequest)
router.post("/:id/accept/:userId", auth, acceptJoinRequest)
router.post("/:id/reject/:userId", auth, rejectJoinRequest)
router.get("/:id/requests", auth, getJoinRequests)

module.exports = router
