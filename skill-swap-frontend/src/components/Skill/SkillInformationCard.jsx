import RequestModel from "./RequestModel"
import RequestWithSwap from "./RequestWithSwap"
const SkillInformationCard = ({ data }) => {
    const {_id, category, level, title, imageUrl, description, user } = data
    const { name, profile, userId } = user || {}
    const { profile_image } = profile || {}
    
    return <div className="skills-information">
        <div className="skill-left">
            <div className="tags">
                <span className="category">{category}</span>
                <span className="level">{level}</span>
            </div>

            <h1 className="title">{title}</h1>
            <p className="description">{description}</p>

            <div className="skill-user-info">
                <img src={profile_image} alt="user" />
                <h4>{name}</h4>                                    
            </div>

            <div className="actions">
                <RequestModel skillId={_id} />
                <RequestWithSwap skillId={_id} />
                
            </div>

        </div>

        <div className="skill-right">
            <img src={imageUrl} alt="skill" />
        </div>

    </div>

}

export default SkillInformationCard