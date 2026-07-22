import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Cookies from "js-cookie"
import { ArrowLeft, Send } from "lucide-react"
import { BsPersonCircle } from "react-icons/bs"
import socket from '../../../Socket'

import {
    fetchMessages,
    sendChatMessage,
    markConversationAsRead,
    fetchConversations
} from "../../../redux/features/chat/chatActions"

import { addMessage, setTyping, markConversationRead } from "../../../redux/features/chat/chatSlice"

import MessageBubble from "./MessageBubble"
import TypingIndicator from "./TypingIndicator"
import styles from "./ChatWindow.module.css"

let typingTimeout = null

const ChatWindow = ({ conversation, onBack }) => {
    const dispatch = useDispatch()
    const myId = Cookies.get("userId")
    const [draft, setDraft] = useState("")
    const bottomRef = useRef(null)

    const messages = useSelector(state => state.chat.messagesByConversation[conversation._id] || [])
    const isOtherTyping = useSelector(state => state.chat.typingByConversation[conversation._id])

    const otherUser = conversation.participants?.find(p => p._id !== myId)

    useEffect(() => {
        dispatch(fetchMessages(conversation._id))
        dispatch(markConversationAsRead(conversation._id))
    }, [conversation._id, dispatch])

    useEffect(() => {
        const handleMessage = ({ conversationId, message }) => {
            if (conversationId !== conversation._id) return
            dispatch(addMessage({ conversationId, message }))
            dispatch(markConversationAsRead(conversationId))
        }

        const handleTyping = ({ conversationId }) => {
            if (conversationId !== conversation._id) return
            dispatch(setTyping({ conversationId, isTyping: true }))
        }
        const handleStopTyping = ({ conversationId }) => {
            if (conversationId !== conversation._id) return
            dispatch(setTyping({ conversationId, isTyping: false }))
        }
        const handleRead = ({ conversationId }) => {
            if (conversationId !== conversation._id) return
            dispatch(markConversationRead(conversationId))
        }
        const handleConversations = ({ conversationId }) => {
            if (conversationId !== conversation._id) return
            dispatch(fetchConversations())
        }

        socket.on("chat:message", handleMessage)
        socket.on("chat:typing", handleTyping)
        socket.on("chat:stop_typing", handleStopTyping)
        socket.on("chat:read", handleRead)
        socket.on("chat:newConv", handleConversations)

        return () => {
            socket.off("chat:message", handleMessage)
            socket.off("chat:typing", handleTyping)
            socket.off("chat:stop_typing", handleStopTyping)
            socket.off("chat:read", handleRead)
            socket.off("chat:newConv", handleConversations)
        }
    }, [conversation._id, dispatch])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth"
        })
    }, [messages.length])

    const emitTyping = () => {
        if (!otherUser) return
        socket.emit("chat:typing", {
            conversationId: conversation._id,
            toUserId: otherUser._id,
            fromUserId: myId
        })
        clearTimeout(typingTimeout)
        typingTimeout = setTimeout(() => {
            socket.emit("chat:stop_typing", {
                conversationId: conversation._id,
                toUserId: otherUser._id,
                fromUserId: myId
            })
        }, 2000)
    }

    const handleChange = (e) => {
        setDraft(e.target.value)
        emitTyping()
    }

    const handleSend = async () => {
        const text = draft.trim()
        if (!text) return
        setDraft("")
        clearTimeout(typingTimeout)
        socket.emit("chat:stop_typing", {
            conversationId: conversation._id,
            toUserId: otherUser?._id,
            fromUserId: myId
        })
        socket.emit("chat:newConv", {
            conversationId: conversation._id,
            toUserId: otherUser?._id,
            fromUserId: myId
        })
        const result = await dispatch(sendChatMessage(conversation._id, text))
        await dispatch(fetchConversations())
        if(result?.payload) {
            dispatch(addMessage({conversationId: conversation._id, message: result.payload}))
        }
        
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }
    return (
        <div className={styles.window}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={onBack} aria-label="Back to conversations">
                    <ArrowLeft size={20} />
                </button>
                {otherUser?.profile?.profile_image ?
                    <img src={otherUser.profile.profile_image} alt="" className={styles.avatar} /> :
                    <BsPersonCircle className={styles.avatarFallback} />
                }
                <div>
                    <div className={styles.name}>
                        {otherUser?.name}
                    </div>
                    {conversation.requestId?.skill?.title && (
                        <div className={styles.subTitle}>
                            {conversation.requestId.skill.title}
                        </div>
                    )}
                </div>
            </div>
            <div className={styles.messages}>
                {messages.map((msg) => (
                    <MessageBubble key={msg._id} message={msg} isMine={msg.sender?._id === myId} />
                ))}
                {isOtherTyping && <TypingIndicator />}
                <div ref={bottomRef} />
            </div>

            <div className={styles.inputBar}>
                <textarea name="" id="" className={styles.input} placeholder="Type a message..." value={draft} onChange={handleChange} onKeyDown={handleKeyDown} rows={1} />
                <button className={styles.sendBtn} onClick={handleSend} disabled={!draft.trim()} aria-label="Send message">
                    <Send size={18} />
                </button>
            </div>
        </div>
    )
}

export default ChatWindow