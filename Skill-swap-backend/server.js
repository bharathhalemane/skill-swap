const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const cors = require("cors")
const passport = require("passport")

dotenv.config()

require("./config/passport")

connectDB()

const app = express()

app.use(cors())
app.use(express.json())        
app.use(express.urlencoded({ extended: true })) 
app.use(passport.initialize())

app.use("/api/auth", require("./routes/authRoutes"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
