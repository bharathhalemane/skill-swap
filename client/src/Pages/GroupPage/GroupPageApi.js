import axios from "axios"
import Cookies from "js-cookie"

const API = import.meta.env.VITE_BACKEND_API

export const getGroupData = async (groupId) => {
    try {
        const token = Cookies.get("jwtToken")
        const url = `${API}/groups/${groupId}`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.data
    } catch (err) {
        return err.message
    }
}