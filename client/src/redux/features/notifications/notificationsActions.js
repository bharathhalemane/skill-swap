import axios from "axios"
import Cookies from "js-cookie"
import {
    setNotifications,
    setUnreadCount,
    markOneReadInState,
    markAllReadInState,
    setLoading
} from "./notificationsSlice"

const API = import.meta.env.VITE_BACKEND_API

const authHeader = () => ({
    headers: { Authorization: `Bearer ${Cookies.get("jwtToken")}` }
})

export const fetchNotifications = () => async (dispatch) => {
    try {
        dispatch(setLoading(true))
        const url = `${API}/notifications`
        const response = await axios.get(url, authHeader())
        dispatch(setNotifications(response.data.data))
    } catch (err) {
        console.log(err)
    } finally {
        dispatch(setLoading(false))
    }
}

export const fetchUnreadCount = () => async (dispatch) => {
    try {
        const url = `${API}/notifications/unread-count`
        const response = await axios.get(url, authHeader())
        dispatch(setUnreadCount(response.data.unreadCount))
    } catch (err) {
        console.log(err)
    }
}

export const markNotificationRead = (id) => async (dispatch) => {
    try {
        const url = `${API}/notifications/${id}/read`
        await axios.patch(url, {}, authHeader())
        dispatch(markOneReadInstate(id))

    } catch (err) {
        console.log(err)
    }
}

export const markAllNotificationsRead = () => async (dispatch) => {
    try {
        const url = `${API}/notifications/read-all`
        await axios.patch(url, {}, authHeader())
        dispatch(markAllReadInState())
    } catch (err) {
        console.log(err)
    }
}