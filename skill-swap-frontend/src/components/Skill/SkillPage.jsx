import { useParams } from "react-router-dom";
import HomeHeader from "../Header/HomeHeader";
import './SkillPage.css';
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { getSkillData, allSkillsOfOwner, availabilityOfOwner } from "./SkillApi"
import SkillInformationCard from "./SkillInformationCard"
import Skills from "./Skills"
import Footer from "../Footer/Footer";
import OwnerAvailability from "./OwnerAvailability";

const SkillPage = () => {
    const { skillId, userId } = useParams();
    const [skillData, setSkillData] = useState({})
    const [availabilityData, setAvailabilityData] = useState([])
    const [allSkillsData, setAllSkillsData] = useState([])

    useEffect(() => {
        const fetchSkillData = async () =>{
            const response = await getSkillData(skillId)
            setSkillData(response.data)
            
        }

        const fetchAvailabilityData = async () => {
            const response = await availabilityOfOwner(userId)
            setAvailabilityData(response.data)
        }

        const fetchAllSkillsData = async () => {
            const response = await allSkillsOfOwner(userId)
            const formattedSkills = response.data.skills.map(skill => ({
                    id: skill._id,
                    title: skill.title,
                    description: skill.description,
                    duration: skill.duration,
                    imageUrl: skill.imageUrl,
                    category: skill.category,
                    level: skill.level,
                    user: {
                        name: skill.user.name,
                        profileImage: skill.user.profile?.profile_image,
                        userId: skill.user._id
                    }
                }))
            setAllSkillsData(formattedSkills)
            
        }


        fetchSkillData()
        fetchAvailabilityData()
        fetchAllSkillsData()
    }, [skillId])


    return (
        <>
            <HomeHeader />
            <div className="skill-page">
                <SkillInformationCard data={skillData} />
                <OwnerAvailability availabilityData={availabilityData} />
                <Skills skillsData={allSkillsData} skillId={skillId} />                
            </div>
            <Footer/>
        </>
    );
};

export default SkillPage;