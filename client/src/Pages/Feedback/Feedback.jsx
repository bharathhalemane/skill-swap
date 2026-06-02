import HomeHeader from "../../components/Header/HomeHeader"
import Footer from "../../components/Footer/Footer"
import styles from "./Feedback.module.css"
import { Bug, Lightbulb, MessageSquareHeart, Sparkle, Star } from
    "lucide-react"
import React, { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

const API = import.meta.env.VITE_BACKEND_API


const feedbackOptions = [
    {
        type: "bug report",
        icon: <Bug color="#E8724B" size={20} />,
        label: "Report a Bug",
    },
    {
        type: "suggestion",
        icon: <Lightbulb color="#E8724B" size={20} />,
        label: "Suggestions",
    },
    {
        type: "praise",
        icon: <Sparkle color="#E8724B" size={20} />,
        label: "Praise",
    },
    {
        type: "other",
        icon: <MessageSquareHeart color="#E8724B" size={20} />,
        label: "Other",
    },
];


const Feedback = () => {
    const [activeFeedbackType, setActiveFeedbackType] = useState("suggestion");
    const [hover, setHover] = useState(0)
    const [rating, setRating] = useState(0)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        feedbackType: activeFeedbackType,
        rating,
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }


    const handleSubmit =async (e) => {
        e.preventDefault()
        try {
            const response =await axios.post(`${API}/feedback/submit`, formData)
            toast.success("Feedback submitted successfully!")
            setFormData({
                name: "",
                email: "",
                feedbackType: activeFeedbackType,
                rating: 0,
                message: ""
            })
        } catch (error) {
            toast.error("Failed to submit feedback.")
        }
        
    }

    return (
        <div className={styles.feedbackPage}>
            <HomeHeader />
            <div className={styles.feedbackContainer}>
                <div className={styles.feedbackIcon}><MessageSquareHeart size={30} /></div>
                <h1 className={styles.feedbackTitle}>Share your <span className={styles.feedbackHighlight}>Feedback</span></h1>
                <p className={styles.feedbackDescription}>We'd love to hear your thoughts and suggestions!</p>


                <form className={styles.feedbackForm} onSubmit={handleSubmit}>
                    <h1 className={styles.mainTitle}>Tell us what's on your mind</h1>
                    <p>All feedback is reviewed by the team. Contact details are optional.</p>

                    <div className={styles.personInfoContainer}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Name (optional)</label>
                            <input type="text" id="name" name="name" placeholder="Your name" onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email (optional)</label>
                            <input type="email" id="email" name="email" placeholder="Your email" onChange={handleChange} />
                        </div>
                    </div>
                    <h1 className={styles.labelTitle}>Feedback Type</h1>
                    <div className={styles.feedbackTypes}>
                        {feedbackOptions.map((item) => (
                            <button
                                key={item.type}
                                type="button"
                                className={`${styles.feedbackType} ${activeFeedbackType === item.type ? styles.active : ""
                                    }`}
                                name="feedbackType"
                                onClick={() => {
                                    setActiveFeedbackType(item.type)
                                    setFormData({
                                        ...formData,
                                        feedbackType: item.type
                                    })
                                }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                    <h1 className={styles.labelTitle}>How would you rate your experience?</h1>
                    <div className={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                role="button"
                                name="rating"
                                className={
                                    star <= (hover || rating)
                                        ? styles.starActive
                                        : styles.star
                                }
                                onClick={() => {
                                    setRating(star) 
                                    setFormData({
                                        ...formData,
                                        rating: star
                                    })
                                }}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                <Star size={25} />
                            </span>
                        ))}
                    </div>
                    <h1 className={styles.labelTitle}>Your Message</h1>
                    <textarea
                        className={styles.feedbackTextarea}
                        placeholder="Write your feedback here..."
                        id="message"
                        name="message"
                        onChange={handleChange}
                    ></textarea>
                    <button type="submit" className={styles.submitBtn}>
                        Submit Feedback
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default Feedback