import axios from "axios"
import Cookies from "js-cookie"
import { fetchGroups } from "../../redux/features/groups/groupsActions"

const API = import.meta.env.VITE_BACKEND_API

export const sendRequest = async (dispatch, groupId, setRequestLoading) => {
    try {
        setRequestLoading(true)
        const token = Cookies.get("jwtToken")
        const response = await axios.post(
            `${API}/groups/${groupId}/request`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        setRequestLoading(false)
        dispatch(fetchGroups())
        return response
    } catch (err) {
        setRequestLoading(false)
        console.log(err)
        return err
    }
}

export const getJoinRequests = async (groupId) => {
    try {
        const token = Cookies.get("jwtToken")
        const response = await axios.get(
            `${API}/groups/${groupId}/requests`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        return response
    } catch (err) {
        console.log(err)
    }
}