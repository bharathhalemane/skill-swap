import { useState, useEffect } from "react"
import { Check, X, BookOpen, SquarePen } from "lucide-react"
import styles from "./AboutGroup.module.css"
import Cookies from "js-cookie"
import { updateBriefDescription } from "../GroupPageApi"

const AboutGroup = ({ data, groupId }) => {
    const { briefDescription, host } = data
    const [isEditing, setIsEditing] = useState(false)
    const [description, setDescription] = useState(briefDescription || " ")
    const [tempDescription, setTempDescription] = useState(briefDescription || "")
    const userId = Cookies.get("userId")

    useEffect(() => {
        setDescription(briefDescription || "");
        setTempDescription(briefDescription || "");
    }, [briefDescription]);

    const handleSave = async () => {
        setDescription(tempDescription)
        setIsEditing(false)
        const response = await updateBriefDescription(groupId, tempDescription)
        console.log(response)
    }

    const handleCancel = () => {
        setTempDescription(description)
        setIsEditing(false)
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <BookOpen size={20} className={styles.icon} />
                    <h2>About this group</h2>
                </div>

                {userId === host._id &&
                    <div className={styles.actions}>
                        {
                            isEditing ?
                                <>
                                    <button className={styles.saveBtn}
                                        onClick={handleSave}
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button className={styles.cancelBtn}
                                        onClick={handleCancel}>
                                        <X size={20} />
                                    </button>
                                </>
                                :
                                <>
                                    <button className={styles.editBtn}
                                        onClick={handleEdit}
                                    >
                                        <SquarePen size={20} />
                                    </button>
                                </>
                        }
                    </div>
                }
            </div>

            {
                isEditing ? <textarea
                    value={tempDescription}
                    onChange={e => setTempDescription(e.target.value)}
                    className={styles.textarea}
                    placeholder="Write about this group..."
                /> :
                    briefDescription !== "" ? <p className={styles.description}>
                        {description}
                    </p> : <p className={styles.description}>{userId === host._id ? "Update about this group" : "Host not updated about this group"}</p>
            }
        </div >
    )
}

export default AboutGroup