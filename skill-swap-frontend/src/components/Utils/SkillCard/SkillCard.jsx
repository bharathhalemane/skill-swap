import { Link } from "react-router-dom"
import './SkillCard.css'

const SkillCard = ({skillsData}) => {
    const {
        id,
        title,
        imageUrl,
        category,
        level,
      description,        
        user
  } = skillsData;
  const { name, profileImage, userId, profile } = user
  let profile_image 
  if (profile) {
    profile_image = profile.profile_image
  }
    return (
    <Link
      to={`/skill/${id}/${userId}`}
      className="skills-card"
    >
      <div className="skill-card-container">
        <img
          src={imageUrl}
          alt={title}
          className="skill-image"
        />
        <div className="category-badge-container">          
            <div className="category-badge">{category}</div>
        </div>
        <div className="skill-level-badge-container">
            <div className={`level-badge level-${level.toLowerCase()}`}>{level}</div>
        </div>
      </div>
      
      <div className="skill-detail-section">    
        <h3 className="skill-title">
          {title}
        </h3>
        <p className="skill-description">
          {description}
          </p>       
        <div className="instructor-info">
          <img
            src={profileImage || profile_image}
            alt={name}
            className="instructor-avatar"
          />
          <span className="instructor-name">
            {name}
          </span>
        </div>    
        </div>        
    </Link>
    );
}

export default SkillCard;
