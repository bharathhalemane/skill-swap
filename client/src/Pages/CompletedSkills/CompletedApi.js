import axios from "axios"
import Cookies from 'js-cookie'

export const completedSkills = async () => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/completed-skills`
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

export const getAnySkills = async () => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/skills/four-skills`
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