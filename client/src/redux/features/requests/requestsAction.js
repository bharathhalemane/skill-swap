import axios from "axios"
import { fetchRequestStart, fetchRequestFailure, fetchReceivedRequestSuccess } from "./requestsSlice"
import Cookies from "js-cookie"

export const fetchReceivedRequest = () => async (dispatch, getState) => {
    try {
        dispatch(fetchRequestStart())
        const token = Cookies.get("jwtToken")
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/received`

        const response = await axios(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch(fetchReceivedRequestSuccess(response.data.data))
    } catch (err) {
        dispatch(fetchRequestFailure(err.message))
    }
}