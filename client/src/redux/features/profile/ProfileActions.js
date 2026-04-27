import axios from "axios"
import { fetchProfile } from "./ProfileSlice"
import Cookies from "js-cookie"

export const fetchProfileData = () => async (dispatch, getState) => {
    const userId = Cookies.get("userId")
    const token = Cookies.get("jwtToken")
    const url = `${import.meta.env.VITE_PROFILE_API}/${userId}`
    const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    })
    const profile = res.data.user.profile
    dispatch(fetchProfile(profile))
}

