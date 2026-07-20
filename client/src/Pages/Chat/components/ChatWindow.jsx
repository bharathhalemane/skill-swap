import { useEffect, useRef, useState } from "react"
import {useDispatch, useSelector} from "react-redux"
import Cookies from "js-cookie"
import {ArrowLeft, Send} from "lucide-react"
import { BsPersonCircle } from "react-icons/bs"
import socket from '../../../Socket'

import {
    fetchMessages, 
    sendChatMessage, 
    markConversationAsRead
} from "../../../redux/features/chat/chatActions"

import { addMessage, setTyping, markConversationRead } from "../../../redux/features/chat/chatSlice"

import MessageBubble from "./MessageBubble"
import styles from "./ChatWindow.module.css"

const ChatWindow = () => {
    return <h1>window</h1>
}

export default ChatWindow