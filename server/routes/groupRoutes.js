const express = require("express")
const { createGroup, getAllGroups } = require("../controllers/groupController")
const auth = require("../middleWare/auth")

const router = express.Router() 

router.post("/create", auth, createGroup);
router.get("/", getAllGroups)

module.exports = router
