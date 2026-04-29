import axios from "axios"
import { fetchProfile, fetchProfileStart, fetchProfileFailure } from "./ProfileSlice"
import Cookies from "js-cookie"

export const fetchProfileData = () => async (dispatch, getState) => {
    try {
        dispatch(fetchProfileStart())
        const userId = Cookies.get("userId")
        const token = Cookies.get("jwtToken")
        const url = `${import.meta.env.VITE_PROFILE_API}/${userId}`
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
        const data = response.data.user
        const cData = {
            email: data.email,
            name: data.name,
            profile: {
                username: data.profile.username,
                bio: data.profile.bio,
                location: data.profile.location,
                profileImage: data.profile.profile_image,
            },
            phoneNumber: data.phoneNumber
        }
        const profile = cData
        dispatch(fetchProfile(profile))
    } catch (err) {
        dispatch(fetchProfileFailure(err.message))
    }
}