import axios from "axios"
import Cookies from "js-cookie"
import {
    chatRequestStart,
    chatRequestFailure,
    setConversations,
    setMessages,
    prependMessages,
    addMessage,
    markConversationRead,
    setUnreadTotal
} from "./chatSlice"


const authHeader = () => ({
    headers: {Authorization: `Bearer ${Cookies.get("jwtToken")}`}
})

const BASE = `${import.meta.env.VITE_BACKEND_API}/chat`

export const fetchConversations = () => async (dispatch) => {
    try {
        dispatch(chatRequestFailure())
        const res = await axios.get(`${BASE}/conversations`, authHeader())
        
        dispatch(setConversations(res.data.data))
    } catch (err) {
        dispatch(chatRequestFailure(err.message))
    }
}

export const getOrCreateConversationByRequest = async (requestId)=>{
    const res = await axios.get(`${BASE}/request/${requestId}`, authHeader())
    return res.data.data
}

export const fetchMessages = (conversationId, before) => async (dispatch) => {
    try {
        const url = before ? `${BASE}/${conversationId}/messages?before=${before}&limit=30`
            : 
            `${BASE}/${conversationId}/messages?limit=30`
        const res = await axios.get(url, authHeader())
        if (before) {
            dispatch(prependMessages({conversationId, messages: res.data.data}))
        } else {
            dispatch(setMessages({conversationId, messages: res.data.data}))
        }
        return res.data.data
    } catch (err) {
        return []        
    }
}

export const sendChatMessage = (conversationId, text) => async (dispatch) => {
    try {
        const res = await axios.post(`${BASE}/${conversationId}/messages`, { text }, authHeader())
        dispatch(addMessage({conversationId,message: res.data.data}))
        return res.data.data 
     } catch (err) {
        return null
    }
}

export const markConversationAsRead = (conversationId) => async (dispatch) => {
    try {
        await axios.put(`${BASE}/${conversationId}/read`, {}, authHeader())
        dispatch(markConversationRead(conversationId))
        dispatch(fetchUnreadTotal())
    }catch(err){
        console.log(err)
    }
}

export const fetchUnreadTotal = () => async (dispatch) => {
    try {
        const res = await axios.get(`${BASE}/unread-count`, authHeader())
        dispatch(setUnreadTotal(res.data.unreadCount))
    } catch (err) {
        console.log(err)
    }
}