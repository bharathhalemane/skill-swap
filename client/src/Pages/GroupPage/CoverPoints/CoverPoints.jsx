import { useEffect, useState } from "react"
import {
    Clock3, SquarePen, Check, X, Trash2, Plus
} from "lucide-react"
import styles from "./CoverPoints.module.css"
import { updateCoverPoints } from "../GroupPageApi"
import Cookies from "js-cookie"

const CoverPoints = ({ data, groupId }) => {
    const { coverPoints, host } = data
    const userId = Cookies.get("userId")
    const [isEditing, setIsEditing] = useState(false)
    const [points, setPoints] = useState(coverPoints || [])
    const [tempPoints, setTempPoints] = useState(
        coverPoints || []
    )


    useEffect(() => {
        setPoints(coverPoints || [])
        setTempPoints(coverPoints || [])
    }, [coverPoints])

    const handlePointChange = (value, index) => {
        const updatedPoints = [...tempPoints]
        updatedPoints[index] = value
        setTempPoints(updatedPoints)
    }

    const handleDeletePoint = (index) => {
        const filteredPoints = tempPoints.filter(
            (_, eachIndex) => eachIndex !== index
        )

        setTempPoints(filteredPoints)
    }

    const handleAddPoint = () => {
        setTempPoints([
            ...tempPoints,
            ""
        ])
    }

    const handleSave = async () => {
        const filteredPoints = tempPoints.filter(
            each => each.trim() !== ""
        )
        setPoints(filteredPoints)

        await updateCoverPoints(groupId, filteredPoints)

        setIsEditing(false)
    }

    const handleCancel = () => {
        setTempPoints(points)
        setIsEditing(false)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <Clock3 size={22} className={styles.icon} />
                    <h2>
                        What we'll cover
                    </h2>
                </div>
                {
                    userId === host._id && (
                        <div className={styles.actions}>
                            {
                                isEditing ? (
                                    <>
                                        <button className={styles.saveBtn}
                                            onClick={handleSave}>
                                            <Check size={20} />
                                        </button>
                                        <button className={styles.cancelBtn} onClick={handleCancel}>
                                            <X size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className={styles.editBtn}
                                            onClick={() => setIsEditing(true)}>
                                            <SquarePen size={20} />
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    )
                }
            </div>
            {
                isEditing ? (
                    <ul className={styles.editList}>
                        {
                            tempPoints.map((each, index) => (
                                <li key={index} className={styles.editItem}>
                                    <span className={styles.dot}>•</span>
                                    <input type="text" value={each}
                                        onChange={e => handlePointChange(e.target.value, index)} className={styles.input}
                                        placeholder="Enter point" />

                                    <button className={styles.deleteBtn}
                                        onClick={() => handleDeletePoint(index)}>
                                        <Trash2 size={18} />
                                    </button>
                                </li>
                            ))
                        }
                        <button className={styles.addBtn} onClick={handleAddPoint}> <Plus size={18}/> Add point</button>
                    </ul>
                ) : (
                        points.length > 0 ? (
                            <ul className={styles.pointsList}>
                                {
                                    points.map((each, index) => (
                                        <li key={index} className={styles.point}>
                                            {each}
                                        </li>
                                    ))
                                }
                            </ul>
                        ): (
                                <p className={styles.emptyText}>
                                    No Cover points added yet
                                </p>
                        )
                )
            }
        </div>
    )
}

export default CoverPoints