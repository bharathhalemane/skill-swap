import { useState } from "react";
import axios from "axios"
import Cookies from "js-cookie"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux";
import { setReviewed } from "../../../redux/features/reviews/reviewsSlice";
import CommonModal from "../../Utils/CommonModal"
import styles from "./ReviewModal.module.css"

const api = import.meta.env.VITE_BACKEND_API

const StarRating = ({ value, onChange }) => (
    <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
            <button key={star}
                type="button" className={`${styles.star} ${star <= value ? styles.starActive : ""}`} onClick={() => onChange(star)} aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}>★</button>
        ))}
    </div>
)

const ReviewModal = ({ isOpen, onClose, learningItem }) => {
    const dispatch = useDispatch()
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState("")
    const [loading, setLoading] = useState(false)

    if (!learningItem) return null

    const handleSubmit = async () => {
        if (rating === 0) {
            toast.warn("Please select a star rating")
            return
        }
        if (review.trim().length < 10) {
            toast.warn("Review must be at least 10 characters")
            return
        }

        setLoading(true)
        try {
            const token = Cookies.get("jwtToken")
            await axios.post(
                `${api}/reviews/submit`, {
                requestId: learningItem.id, rating, review
            },
                { headers: { Authorization: `Bearer ${token}` } }
            )

            dispatch(setReviewed({ requestId: learningItem.id, value: true }))

            toast.success("Review submitted! Thank you")
            setRating(0)
            setReview("")
            onClose()
        } catch (err) {
            const msg = err.response?.data?.msg || "Failed to submit review"
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <CommonModal
            isOpen={isOpen}
            onClose={onClose}
            title="Rate & Review"
            width="480px"
        >
            <div className={styles.wrapper}>
                <div className={styles.info}>
                    <img src={learningItem.skill?.imageUrl} alt={learningItem.skill?.title} className={styles.skillImg} />
                    <div>
                        <p className={styles.skillTitle}>{learningItem.skill?.title}</p>
                        <p className={styles.teacherName}>taught by <strong>{learningItem.partner?.name}</strong></p>
                    </div>
                </div>

                <hr className={styles.divider} />

                <label htmlFor="" classNam={styles.label}>Your Rating</label>
                <StarRating value={rating} onChange={setRating} />

                <label htmlFor="" className={styles.label} style={{ marginTop: "18px" }}>Your Review</label>
                <textarea
                    className={styles.textarea}
                    placeholder="Share what you learned, how the teacher helped you, what made the session great..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    maxLength={1000}
                    rows={5}
                />
                <p className={styles.charCount}>{review.length}</p>

                <div className={styles.actions}>
                    <button className={styles.skipBtn} onClick={onClose} disabled={loading}>Skip for now</button>
                    <button className={styles.submitBtn} onClick={handleSubmit} disabled={loading}>
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </div>
        </CommonModal>
    )
}

export default ReviewModal