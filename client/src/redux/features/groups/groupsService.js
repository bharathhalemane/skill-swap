import axios from "axios"
import Cookies from "js-cookie"

const Api = import.meta.env.VITE_BACKEND_API 

export const createGroupApi = async (data) => {
    const token = Cookies.get("jwtToken")

    const res = await axios.post(`${Api}/groups/create`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return res.data.data 
}

export const fetchGroupsApi = async () => {
    const res = await axios.get(`${Api}/groups`)
    return res.data.data
}