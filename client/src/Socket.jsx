import { io } from "socket.io-client"

const socketUrl = import.meta.env.VITE_BACKEND
export const socket = io(socketUrl, {
    transports: ["websocket"],
    withCredentials: true
})

socket.on("connect", () => {
    console.log("connected", socket.id)
})
socket.on("disconnect", (reason) => {
    console.log("disconnected:", reason)
})
socket.on("connect_error", (err) => {
    console.log("connect error:", err.message)
})

export default socket