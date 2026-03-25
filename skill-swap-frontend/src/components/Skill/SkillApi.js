import axios from "axios";
import Cookies from 'js-cookie'
import { toast } from "react-toastify";

const token = Cookies.get("jwtToken")

export const sentRequest = async ({skillId, message}) => {

    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/requests/send`;

        const data = {
            skillId: skillId,
            message: message
        };

        const response = await axios.post(url, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        toast.success("Request sent successfully")
        return response

    } catch (err) {
        toast.error("already sent!");
        console.log(err)
    }
}

export const getSkillData = async (id) => {
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/skills/${id}`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response
    } catch (err) {
        console.log(err)
    }
}

export const allSkillsOfOwner = async (id) => {
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/skills/owner/${id}`
        const response = await axios.get(url)
        return response;
    } catch (err) {
        console.log(err)
    }
}

export const availabilityOfOwner = async (id) => {
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}/availability/owner/availabilities/${id}`
        const response = await axios.get(url)
        return response
    } catch (err) {
        console.log(err)
    }
}

export const getOwnerData = async (id) => {
    try {
        const url = `${import.meta.env.VITE_BACKEND_API}`
    }catch(err){
        console.log(err)
    }
}