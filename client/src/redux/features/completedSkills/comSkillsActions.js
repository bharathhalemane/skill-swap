import axios from "axios"
import Cookies from 'js-cookie'

import { fetchCompletedSkills,fetchSkillStart, fetchSkillsFailure, fetchSkillsSuccess } from "./comSkillsSlice"

export const fetchComSkills = () => async (dispatch, getState) => {
    const token = Cookies.get("jwtToken")
    try {
        dispatch(fetchSkillStart())
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/completed-skills`
        const response = await axios(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch(fetchCompletedSkills(response.data.data))
        dispatch(fetchSkillsSuccess())
        
    }catch (err) {
        dispatch(fetchSkillsFailure(err.message))
    }
}