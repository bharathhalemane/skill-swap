import { useParams } from "react-router-dom";
import HomeHeader from "../Header/HomeHeader";
import './SkillPage.css';
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { toast } from "react-toastify";

const SkillPage = () => {
    const { id } = useParams();
    const token = Cookies.get("jwtToken");    

    const sendRequest = async () => {        

        try {
            const url = `${import.meta.env.VITE_BACKEND_API}/requests/send`;

            const data = { 
                skillId: id,
                message: "I want to learn this skill"
            };

            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });                
            console.log(response)
            toast.success("Request sent successfully")

        } catch (err) {            
            toast.error("already sent!");
            console.log(err)
        }
    };

    return (
        <>
            <HomeHeader />
            <div className="skill-page">
                <h1>Skill ID: {id}</h1>

                <button onClick={sendRequest}>Request</button>
                
            </div>
        </>
    );
};

export default SkillPage;