
require("dotenv").config()
const express = require("express")
const http = require("http")
const { initSocket } = require("./socket")

const connectDB = require("./config/db")
const cors = require("cors")
const helmet = require("helmet")
const passport = require("passport")

const userRoutes = require("./routes/user")
const skillsRoutes = require("./routes/skillsRoutes")
const classScheduleRoutes = require("./routes/classScheduleRoutes")
const availabilityRoute = require("./routes/availabilityRoutes")
const authRoutes = require("./routes/authRoutes")
const requestRoutes = require("./routes/requestRoutes")
const groupRoutes = require("./routes/groupRoutes")
const feedbackRoutes = require("./routes/feedbackRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const chatRoutes = require("./routes/chatRoutes")

require("./config/passport")
connectDB()

const app = express()

const server = http.createServer(app)
initSocket(server)

app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(passport.initialize())

app.use("/api/auth", authRoutes)
app.use("/api/skills", skillsRoutes)
app.use("/api/profile", userRoutes)
app.use("/api/classes", classScheduleRoutes)
app.use("/api/availability", availabilityRoute)
app.use("/api/requests", requestRoutes)
app.use("/api/groups", groupRoutes)
app.use("/api/feedback", feedbackRoutes)
app.use("/api/reviews", reviewRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/chat", chatRoutes)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`server running on port ${PORT}`))
