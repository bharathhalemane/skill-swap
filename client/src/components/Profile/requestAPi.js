import axios from "axios"
import Cookies from 'js-cookie'
import { toast } from "react-toastify"
import { fetchReceivedRequest, fetchSentRequests } from "../../redux/features/requests/requestsAction"


export const acceptRequest = async (dispatch, id, name) => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/accept/${id}`
        const response = await axios.put(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch(fetchReceivedRequest())
        toast.success(`Accepted! ${name} request`)
    } catch (err) {
        toast.error(err.message)
    }
}

export const rejectRequest = async (dispatch, id, name) => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/reject/${id}`
        
        await axios.put(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch(fetchReceivedRequest())
        toast.success(`Rejected! ${name} request`)
    } catch (err) {
        toast.error(err.message)
    }
}

export const getSentRequest = async () => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/sent`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (err) {
        console.log(err)
    }
}

export const resendRequest = async (dispatch, id) => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/resend/${id}`
        const res = await axios.patch(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch(fetchSentRequests())
        toast.success("Request resent!")
    }catch(err){
        toast.error(err.response?.data?.msg)
    }
}

export const cancelRequest = async (dispatch, id) => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/cancel/${id}`
        const response = await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch(fetchSentRequests())
        toast.success("Request cancelled!")
    } catch (err) {
        toast.error(err.response?.data?.msg)
    }
}

export const learningSkills = async () => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/learning`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    }catch(err){
        console.log(err)
    }
}

export const endLearning = async (id) => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/end/${id}`
        const res = await axios.patch(url, {},{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        toast.success("Learning ended")
        return res
    } catch (err) {
        toast.error(err.response?.data?.msg)
    }
}