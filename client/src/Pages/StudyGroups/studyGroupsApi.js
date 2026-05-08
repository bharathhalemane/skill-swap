import axios from "axios"
import Cookies from "js-cookie"
import { fetchGroups } from "../../redux/features/groups/groupsActions"
import { toast } from "react-toastify"
const API = import.meta.env.VITE_BACKEND_API

export const sendRequest = async (dispatch, groupId, setRequestLoading) => {
    try {
        setRequestLoading(true)
        const token = Cookies.get("jwtToken")
        const response = await axios.post(
            `${API}/groups/${groupId}/request`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        setRequestLoading(false)
        dispatch(fetchGroups())
        return response
    } catch (err) {
        setRequestLoading(false)
        console.log(err)
        return err
    }
}

export const getJoinRequests = async (groupId) => {
    try {
        const token = Cookies.get("jwtToken")
        const response = await axios.get(
            `${API}/groups/${groupId}/requests`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )
        return response
    } catch (err) {
        toast.error(err)

    }
}

export const acceptRequest = async (dispatch, groupId, senderId) => {
    try {
        const token = Cookies.get("jwtToken")
        const response = await axios.post(
            `${API}/groups/${groupId}/accept/${senderId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )
        dispatch(fetchGroups())
        toast.info(response.data.message)
    } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong")
    }
}

export const rejectRequest = async (dispatch, groupId, senderId) => {
    try {
        console.log(groupId, senderId)

        const token = Cookies.get("jwtToken")

        const response = await axios.post(
            `${API}/groups/${groupId}/reject/${senderId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        )
        dispatch(fetchGroups())
        toast.info(response.data.message)
    } catch (err) {
        console.log(err)
        toast.error(err.response?.data?.message || "Something went wrong")
    }
}