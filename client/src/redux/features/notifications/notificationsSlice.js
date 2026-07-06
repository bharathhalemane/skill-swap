import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    list: [],
    unreadCount: 0,
    loading: false
}

const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            state.list = action.payload 
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload
        },
        addNotification: (state, action) => {
            const { notification, unreadCount } = action.payload  
            state.list.unshift(notification)
            state.unreadCount = unreadCount 
        },
        markOneReadInState: (state, action) => {
            const id = action.payload 
            const item = state.list.find(n=> n._id === id)
            if (item && !item.read) {
                item.read = true 
                state.unreadCount = Math.max(0, state.unreadCount - 1)
            }
        },
        markAllReadInState: (state) => {
            state.list = state.list.map(n => ({ ...n, read: true })) 
            state.unreadCount = 0
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }

    }
})

export const { setNotifications, setUnreadCount, setLoading, addNotification, markOneReadInState, markAllReadInState } = notificationsSlice.actions;
export default notificationsSlice.reducer;