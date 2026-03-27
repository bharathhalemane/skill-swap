import axios from "axios"
import Cookies from 'js-cookie'
import { toast } from "react-toastify"

export const getReceivedRequests = async () => {
    
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/received`

        const response = await axios(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    }catch(err){
        console.log(err)
    }
}

export const acceptRequest = async (id, name) => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/accept/${id}`
        const response = await axios.put(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        toast.success(`Accepted! ${name} request`)
    } catch (err) {
        toast.error(err.message)
    }
}

export const rejectRequest = async (id, name) => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/reject/${id}`
        
        await axios.put(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
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

export const resendRequest = async (id) => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/resend/${id}`
        const res = await axios.patch(url, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        toast.success("Request resent!")
        return res
    }catch(err){
        toast.error(err.response?.data?.msg)
    }
}