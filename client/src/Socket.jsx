import { io } from "socket.io-client"

export const socket = io("http://localhost:5000", {
    transports: ["websocket"],
    withCredentials: true
})

socket.on("connect", () => {
    console.log("✅ Connected to server:", socket.id)
})

export default socket