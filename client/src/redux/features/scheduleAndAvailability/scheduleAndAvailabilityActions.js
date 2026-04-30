import axios from "axios"
import Cookies from "js-cookie"
import { updateScheduleData, updateAvailabilityData, updateTitles } from "./scheduleAndAvailabilitySlice"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const fetchScheduleData = () => async (dispatch, getState) => {
    const token = Cookies.get("jwtToken")
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/classes`
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
        dispatch(updateScheduleData(response.data))
    } catch (err) {
        console.log(error)
    }
}

export const fetchSkillsTitles = () => async (dispatch, getState) => {
    try {
        const userId = Cookies.get("userId")
        const token = Cookies.get("jwtToken")
        const url = `${import.meta.env.VITE_SKILL_API}/${userId}/titles`
        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
        dispatch(updateTitles(response.data))
    } catch (err) {
        console.log(err)
    }
}

export const fetchAvailabilityData = () => async (dispatch, getState) => {
    try {
        const token = Cookies.get("jwtToken")
        const url = `${import.meta.env.VITE_BACKEND_API}/availability/my`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const sorted = response.data.sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day))
        dispatch(updateAvailabilityData(sorted))
    } catch (err) {
        console.log(err)
    }
}