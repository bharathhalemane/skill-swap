import axios from "axios"
import { fetchRequestStart, fetchRequestFailure, fetchReceivedRequestSuccess, fetchSentRequestsSuccess } from "./requestsSlice"
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

export const fetchSentRequests = () => async(dispatch, getState) => {
    const token = Cookies.get("jwtToken")
    try{
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/sent`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        dispatch(fetchSentRequestsSuccess(response.data))
    } catch (err) {
        console.log(err)
    }
}