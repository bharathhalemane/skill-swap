import { Link } from "react-router-dom"
import './SkillCard.css'

const SkillCard = props => {
    const {
        id,
        title,
        image,
        category,
        level,
        description,
        instructor,
        rating,
        reviews,
        duration
    } = props;
    return (
    <Link
      to={`/skill/${id}`}
      className="skills-card"
    >
      <div className="container">
        <img
          src={image}
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
            src={instructor.avatar}
            alt={instructor.name}
            className="instructor-avatar"
          />
          <span className="instructor-name">
            {instructor.name}
          </span>
        </div>       
      </div>
    </Link>
    );
}

export default SkillCard;