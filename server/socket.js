let io
const onlineUsers = {}

const initSocket = (server) => {
    const { Server } = require("socket.io")

    io = new Server(server, {
        cors: { origin: process.env.FRONTEND_URL, methods: ["GET", "POST", "PUT", "DELETE"], credentials: true }
    })

    io.on("connection", (socket) => {
        socket.on("register", (userId) => {
            onlineUsers[userId] = socket.id
            // console.log("📡 Online Users:", onlineUsers);
        })

        socket.on("disconnect", () => {
            for (let user in onlineUsers) {
                if (onlineUsers[user] === socket.id) {
                    delete onlineUsers[user]
                    // console.log("User offline:", user);
                }
            }
        })
    })
}

const getIO = () => io

module.exports = { initSocket, getIO, onlineUsers }