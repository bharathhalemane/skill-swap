import axios from "axios"
import Cookies from 'js-cookie'

const token = Cookies.get("jwtToken")

export const getReceivedRequests = async () => {
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