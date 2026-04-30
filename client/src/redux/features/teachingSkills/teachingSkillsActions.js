import axios from "axios"
import { fetchTeachingSkills as storeTeachingSkills, setPage } from "./teachingSkillsSlice";
import Cookies from "js-cookie"


export const fetchTeachingSkills = () => async (dispatch, getState) => {
    const userId = Cookies.get("userId")
    const token = Cookies.get("jwtToken")
    try {
        const {page} = getState().teachingSkills
        const url = `${import.meta.env.VITE_SKILL_API}/user/${userId}?page=${page}&limit=4`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch(storeTeachingSkills(response.data))
    } catch (err) {
        console.log(err)
    }
}

export const updatePage = (page) => (dispatch) => {
    dispatch(setPage(page))
    dispatch(fetchTeachingSkills())
}