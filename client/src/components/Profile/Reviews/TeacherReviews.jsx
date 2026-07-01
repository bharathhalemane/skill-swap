import { useEffect, useState } from "react"
import axios from "axios"
import styles from "./TeacherReviews.module.css"
import { MessageCircle } from "lucide-react"

const Stars = ({ value }) => (
    <span className={styles.starRow}>
        {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={s <= value ? styles.starFilled : styles.starEmpty}> ★</span>
        ))}
    </span>
)

const TeacherReviews = ({ teacherId, limit, compact = false }) => {
    const [reviews, setReviews] = useState([])
    const [average, setAverage] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!teacherId) return
        setLoading(true)
        axios.get(`${import.meta.env.VITE_BACKEND_API}/reviews/teacher/${teacherId}` + (limit ? `?limit=${limit}` : ""))
            .then((res) => {
                setReviews(res.data.data)
                setAverage(res.data.average)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [teacherId])

    if (loading) return <p className={styles.loading}>loading reviews...</p>
    if (reviews.length === 0) return (
        <div className={styles.empty}>
            <span className={styles.emptyIcon}><MessageCircle size={20} /></span>
            <p>No reviews yet for this teacher.</p>
        </div>
    )

    return (
        <div className={styles.container}>
            {
                !compact && (<div className={styles.summary}>
                    <span className={styles.avgScore}>{average}</span>
                    <Stars value={Math.round(average)} />
                    <span className={styles.totalCount}>({reviews.length} review {reviews.length !== 1 ? "s" : ""})</span>
                </div>)
            }

            <div className={styles.list}>
                {
                    reviews.map((r) => (
                        <div className={styles.card} key={r._id}>
                            <div className={styles.cardHeader}>
                                {
                                    r.reviewer?.profile?.profile_image ? <img src={r.reviewer.profile.profile_image} alt="" className={styles.avatar} /> :
                                        <div className={styles.avatarFallback}>
                                            {r.reviewer?.name?.[0]?.toUpperCase() ?? "?"}
                                        </div>
                                }
                                <div className={styles.meta}>
                                    <p className={styles.reviewerName}>{r.reviewer?.name ?? "Anonymous"}</p>
                                    <Stars value={r.rating} />
                                </div>
                                <span className={styles.skillTag}>{r.skill?.title}</span>
                            </div>
                            <p className={styles.reviewText}>{r.review}</p>
                            <p className={styles.date}>{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default TeacherReviews