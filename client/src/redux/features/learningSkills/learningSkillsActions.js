import axios from "axios"
import { updateLearningSkills } from "./learningSkillsSlice"
import Cookies from "js-cookie"

export const fetchLearningSkills = () => async (dispatch, getState) => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/learning`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch(updateLearningSkills(response.data.data))
    } catch (err) {
        console.log(err)
    }
}
