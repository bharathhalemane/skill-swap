const mongoose = require("mongoose")

mongoose.connect("YOUR_FULL_URI_HERE")
    .then(() => {
    console.log("URI:", process.env.MONGO_URI)
  console.log("Connected Successfully")
  process.exit(0)
})
    .catch(err => {
    console.log("URI:", process.env.MONGO_URI)
  console.error("Connection Failed:")
  console.error(err)
  process.exit(1)
})