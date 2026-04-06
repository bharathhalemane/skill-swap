import SkillCard from "../../Utils/SkillCard/SkillCard"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import styles from './Skills.module.css'

const getSliderSettings = (count) => ({
    dots: false,
    infinite: count > 3,
    speed: 500,
    slidesToShow: window.innerWidth < 480 ? 1 : 4,
    slidesToScroll: 1,
})

const Skills = ({ skillsData, skillId }) => {
    const filteredSkills = skillsData.filter(each => each.id !== skillId)

    if (!skillsData || skillsData.length === 0) {
        return <p className={styles.noSkills}>No skills available</p>
    }

    return (
        <div className={styles.skillsSliderContainer}>
            <h1>Other Skills</h1>
            {filteredSkills.length > 4
                ? <Slider {...getSliderSettings(filteredSkills.length)}>
                    {filteredSkills.map(each => (
                        <div key={each.id || each._id}>
                            <SkillCard skillsData={each} />
                        </div>
                    ))}
                </Slider>
                : <div className={styles.staticGrid}>
                    {filteredSkills.map(each => (
                        <div key={each.id || each._id}>
                            <SkillCard skillsData={each} />
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}

export default Skills