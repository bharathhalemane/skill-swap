import {createSlice} from "@reduxjs/toolkit"
import { setUnreadCount } from "../notifications/notificationsSlice"


const chatSlice = createSlice({
    name: "chat",
    initialState: {
        conversations: [],
        activeConversationId: null,
        messagesByConversation: {},
        typingByConversation: {},
        unreadTotal: 0,
        loading: false,
        error: null
    },

    reducers: {
        chatRequestStart(state) {
            state.loading = true 
            state.error = null
        },
        chatRequestFailure(state, action) {
            state.loading = false
            state.conversations = action.payload
        },
        setConversations(state, action) {
          state.loading = false
          state.conversations = action.payload  
        },
        upsertConversation(state, action) {
            const conv= action.payload
            const idx = state.conversations.findIndex(c => c._id === conv._id)
            if(idx >= 0){
                state.conversations[idx] = {...state.conversations[idx], ...conv}
            }else{
                state.conversations.unshift(conv)
            }
        },
        setActiveConversation(state, action) {
            state.activeConversationId = action.payload 
        },
        setMessages(state, action) {
            const { conversationId, messages } = action.payload
            state.messagesByConversation [conversationId]=messages
        },
        prependMessages(state, action) {
            const {conversationId, messages} = action.payload 
            const existing = state.messagesByConversation[conversationId] || [] 
            state.messagesByConversation[conversationId] = [...messages, ...existing]
        },
        addMessage(state, action) {
            const { conversationId, message } = action.payload
            const existing = state.messagesByConversation[conversationId] || []
            
            if (existing.some(m => m._id === messages._id)) return
            state.messagesByConversation[conversationId] = [...existing, message]
            
            const convIdx = state.conversations.findIndex(c => c._id === conversationId)
            if (convIdx >= 0) {
                state.conversations[convIdx].lastMessage = message.text 
                state.conversations[convIdx].lastMessageAt = message.createdAt 

                const [conv] = state.conversations.splice(convIdx, 1)
                state.conversations.unshift(conv)
            }
        },
        markConversationRead(state, action) {
            const conversationId = action.payload 
            const messages = state.messagesByConversation[conversationId]
            if (messages) {
                state.messagesByConversation[conversationId] = messages.map(m => ({...m, status: "read"}))
            }
            const conv = state.conversations.find(c => c._id===conversationId)
            if(conv) conv.unreadTotal=0
        },
        setTyping(state, action) {
            const { conversationId, isTyping } = action.payload 
            state.typingByConversation[conversationId] = isTyping
        },
        setUnreadTotal(state, action) {
            state.unreadTotal=action.payload
        }

    }
})

export const {
    chatRequestFailure,
    chatRequestStart,
    setActiveConversation,
    setConversations,
    upsertConversation,
    setMessages,
    prependMessages,
    addMessage,
    markConversationRead,
    setTyping,
    setUnreadTotal
} = chatSlice.actions 

export default chatSlice.reducer