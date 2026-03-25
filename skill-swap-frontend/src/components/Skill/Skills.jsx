import SkillCard from "../Utils/SkillCard/SkillCard"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import Slider from "react-slick"
const Skills = ({ skillsData, skillId }) => {
    const filteredSkills = skillsData.filter(each=> each.id !== skillId)
    const settings = {
        dots: false,
        infinite: skillsData?.length > 3,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1
    }

    if (!skillsData || skillsData.length === 0) {
        return <p className="no-skills">No skills available</p>
    }

    return (
        <div className="skills-slider-container">
            <h1 className="">Other Skills</h1>
            {
                filteredSkills.length > 4 ? <Slider {...settings}>
                {filteredSkills.map(each => (
                    <div><SkillCard skillsData={each} key={each._id} /></div>
                ))}
                </Slider> : <>
                {filteredSkills.map(each => (
                    <div><SkillCard skillsData={each} key={each._id} /></div>
                ))}
                    </>
            }
        </div>
    )
    
}

export default Skills