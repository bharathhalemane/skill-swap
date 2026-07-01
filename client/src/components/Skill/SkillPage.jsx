import { useParams } from "react-router-dom";
import HomeHeader from "../Header/HomeHeader";
import './SkillPage.css';
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { getSkillData, allSkillsOfOwner, availabilityOfOwner } from "./SkillApi"
import SkillInformationCard from "./SkillInformationCard/SkillInformationCard";
import Skills from "./Skills/Skills"
import Footer from "../Footer/Footer";
import OwnerAvailability from "./OwnerAvailability/OwnerAvailability";
import SkillInformationCardSkeleton from "./SkillInformationCard/SkillInformationCardSkeleton";
import SkillCardSkeleton from "../Utils/SkillCard/SkillCardSkeleton";

const apiProgress = {
    loading: 'LOADING',
    success: 'SUCCESS'
}
const SkillPage = () => {
    const { skillId, userId } = useParams();
    const [skillData, setSkillData] = useState({})
    const [skillDataProgress, setSkillDataProgress] = useState(apiProgress.loading)
    const [availabilityData, setAvailabilityData] = useState([])
    const [availabilityDataProgress, setAvailabilityDataProgress] = useState(apiProgress.loading)
    const [allSkillsData, setAllSkillsData] = useState([])

    useEffect(() => {
        const fetchSkillData = async () => {
            setSkillDataProgress(apiProgress.loading)
            const response = await getSkillData(skillId)
            setSkillData(response.data)
            setSkillDataProgress(apiProgress.success)
        }

        const fetchAvailabilityData = async () => {
            setAvailabilityDataProgress(apiProgress.loading)
            const response = await availabilityOfOwner(userId)
            setAvailabilityData(response.data)
            setAvailabilityDataProgress(apiProgress.success)
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
                    userId: skill.user._id,
                    email: skill.user.email
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
                {skillDataProgress === apiProgress.loading ? <SkillInformationCardSkeleton /> : <SkillInformationCard data={skillData} />}
                {allSkillsData.length > 0 ? <Skills skillsData={allSkillsData} skillId={skillId} /> :
                    <ul className="skills-skeleton">
                        {
                            Array(window.innerWidth < 480?1 : 4)
                        .fill(0).map((_, i) => <SkillCardSkeleton key={i}/>
                        )
                        }
                    </ul>
                }
                <div className="details">
                    <OwnerAvailability availabilityData={availabilityData} isLoading={availabilityDataProgress === apiProgress.loading ? true : false}/>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default SkillPage;