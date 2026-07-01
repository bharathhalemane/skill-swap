import { Mail, Phone, Star } from "lucide-react";
import RequestModel from "../Modals/RequestModel"
import RequestWithSwap from "../Modals/RequestWithSwap"
import EditSkillModal from "../Modals/EditSkillModal";
import styles from './SkillInformationCard.module.css'
import { BsPersonCircle } from "react-icons/bs";
import Cookies from "js-cookie"
import TeacherReviews from "../../Profile/Reviews/TeacherReviews"


const SkillInformationCard = ({ data }) => {
    const uId = Cookies.get("userId")
    const { _id, category, level, title, imageUrl, description, user, rating } = data
    const { name, email, profile, _id: userId, phoneNumber } = user || {}
    const { profile_image } = profile || {}
    const avgRating = rating?.avgRating || 0 
    const reviewCount = rating?.reviewCount || 0

    const deleteSkill = async (skillId) => {
        try {
            const url = `${import.meta.env.VITE_SKILL_API}/delete/${skillId}`
            await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.warning("Skill Deleted Successfully!")
            getUserSkillData()
        } catch (err) {
            toast.error("Unable to delete Skill Retry!")
        }
    }

    return (
        <div className={styles.skillsInformation}>
            <div className={styles.skillLeft}>
                <div className={styles.tags}>
                    <span className={styles.category}>{category}</span>
                    <span className={styles.level}>{level}</span>
                </div>

                <h1 className={styles.title}>{title}</h1>
                <p className={styles.description}>{description}</p>

                <div className={styles.skillUserInfo}>
                    {
                        profile_image ? <img src={profile_image} alt="user" /> : <BsPersonCircle className={styles.profile} />
                    }
                    <div className={styles.userInformation}>
                        <h4>{name}</h4>
                        {
                            reviewCount > 0 && (
                                <div className={styles.teacherRating}>
                                    <Star size={16} className={styles.teacherRatingStar}/>
                                    <span className={styles.teacherRatingValue}>{avgRating}</span>
                                    <span className={styles.teacherRatingCount}>{reviewCount} review{reviewCount !== 1 ? 's' : ''}</span>
                                </div>
                            )
                        }
                        <div className={styles.contactInformation}>
                            <div>
                                <Mail />
                                <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
                                    {email}
                                </a>
                            </div>
                            {
                                phoneNumber && <div>
                                    <Phone />
                                    <a href={`tel:${phoneNumber}`}>{phoneNumber}</a>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    {
                        userId === uId ? <>
                            <EditSkillModal skillId={_id} skillData={data} />
                            <button className={styles.deleteButton} onClick={()=> deleteSkill(_id)}>Delete Skill</button>
                        </> : <>
                            <RequestModel skillId={_id} />
                            <RequestWithSwap skillId={_id} />
                        </>
                    }
                </div>
                {
                    userId && (
                        <div className={styles.topReviews}>
                            <h3 className={styles.topREviewsHeading}>What learners say</h3>
                            <TeacherReviews teacherId={userId} limit={3} compact/>
                        </div>
                    )
                }
            </div>

            <div className={styles.skillRight}>
                <img src={imageUrl} alt="skill" />
            </div>
        </div>
    )
}

export default SkillInformationCard