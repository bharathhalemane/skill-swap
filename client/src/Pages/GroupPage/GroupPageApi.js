import axios from "axios"
import Cookies from "js-cookie"
import { toast } from "react-toastify"

const API = import.meta.env.VITE_BACKEND_API

export const getGroupData = async (groupId) => {
    try {
        const token = Cookies.get("jwtToken")
        const url = `${API}/groups/${groupId}`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data.data
    } catch (err) {
        return err.message
    }
}

export const updateBriefDescription = async (
    groupId,
    description
) => {
    try {
        const token = Cookies.get("jwtToken");

        const url = `${API}/groups/${groupId}/brief-description`;

        const response = await axios.put(
            url,
            { briefDescription: description },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        toast.success(response.data.message);

        return response.data.group;

    } catch (err) {
        toast.error(
            err.response?.data?.message || err.message
        );
    }
};

export const updateCoverPoints = async (
    groupId, 
    coverPoints
) => {
    try {
        const token = Cookies.get("jwtToken")
        const url = `${API}/groups/${groupId}/cover-points`
        const response = await axios.put(url, {coverPoints}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        toast.success(response.data.message)

    } catch (err) {
        toast.error(
            err.response?.data?.message || err.message
        )
    }
}