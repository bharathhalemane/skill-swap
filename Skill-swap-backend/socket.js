let io
const onlineUsers = {}

const initSocket = (server) => {
    const { Server } = require("socket.io")
    
    io = new Server(server, {
        cors: { origin: "http://localhost:5173", methods: ["GET","POST","PUT","DELETE"], credentials: true }
    })

    io.on("connection", (socket) => {

        socket.on("join", (userId) => {
            onlineUsers[userId] = socket.id 
        })

        socket.on("disconnect", () => {
            for (let user in onlineUsers) {
                if (onlineUsers[user] === socket.id) {
                    delete onlineUsers[user]
                }
            }
        })
    })
}

const getIO = () => io 

module.exports = {initSocket, getIO, onlineUsers}