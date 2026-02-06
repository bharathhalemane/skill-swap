import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import cors from "cors"
import passport from "passport"

//for production purpose
import path from "path"

dotenv.config({
  path: path.join(__dirname, ".env"),
});
console.log("ENV CHECK:", {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
});
import "./config/passport.js"

connectDB()

const app = express()

//for production purpose
const __dirname = path.resolve();
console.log(__dirname)

app.use(cors())
app.use(express.json())        
app.use(express.urlencoded({ extended: true })) 
app.use(passport.initialize())

app.use("/api/auth", require("./routes/authRoutes"))

app.use(express.static(path.join(__dirname, "/skill-swap-frontend/dist")))
app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "skill-swap-frontend", "dist", "index.html"))
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
