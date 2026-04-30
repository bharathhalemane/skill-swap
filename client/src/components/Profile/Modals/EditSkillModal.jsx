import { HiMiniPencil } from "react-icons/hi2"
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import CommonModal from "../../Utils/CommonModal";
import { toast } from "react-toastify";
import styles from './Modal.module.css'
import { useDispatch } from "react-redux";
import { fetchTeachingSkills } from "../../../redux/features/teachingSkills/teachingSkillsActions";

const apiProgress = {
    loading: "LOADING",
    success: "SUCCESS"
}

const EditSkillModal = ({ skillId, skillData }) => {
    const dispatch = useDispatch()
    const token = Cookies.get("jwtToken")
    const [isOpen, setIsOpen] = useState(false)
    const [apiStatus, setApiStatus] = useState(apiProgress.success)
    const [preview, setPreview] = useState(skillData.imageUrl)
    const [formData, setFormData] = useState({
        title: skillData.title,
        category: skillData.category,
        description: skillData.description,
        duration: skillData.duration,
        level: skillData.level,
        image: skillData.imageUrl
    })

    const handleChange = e => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleImageChange = e => {
        const file = e.target.files[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
            setFormData(prev => ({ ...prev, image: file }))
        }
    }

    const editSkill = async () => {
        setApiStatus(apiProgress.loading)
        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("category", formData.category)
            data.append("description", formData.description)
            data.append("duration", formData.duration)
            data.append("level", formData.level)
            if (formData.image) {
                data.append("image", formData.image)
            }
            const url = `${import.meta.env.VITE_SKILL_API}/update/${skillId}`
            await axios.put(url, data, {
                headers: { Authorization: `Bearer ${token}` }
            })
            toast.success("Skill edited!")
            setApiStatus(apiProgress.success)
            dispatch(fetchTeachingSkills())
            setIsOpen(false)
        } catch (err) {
            toast.error("Unable to edit the skill. try Again!!")
            setIsOpen(false)
        }
    }

    const onSubmit = e => {
        e.preventDefault()
        editSkill()
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)} className={styles.createSkillButton}>
                <HiMiniPencil size={20} color="#000" />
            </button>

            <CommonModal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Skill" width="550px">
                <form className={styles.modernForm} onSubmit={onSubmit}>

                    <div className={styles.imageUploadWrapper}>
                        <label className={styles.imageUploadContainer}>
                            {preview
                                ? <img src={preview} alt="preview" className={styles.uploadedImage} />
                                : <div className={styles.imagePlaceholder}>Upload Image</div>
                            }
                            <input
                                type="file"
                                accept="image/*"
                                name="image"
                                className={styles.fileInput}
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Skill Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g., Web Development with React"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="">Select a category</option>
                            <option value="Languages">Languages</option>
                            <option value="Sports">Sports</option>
                            <option value="Design">Design</option>
                            <option value="Music">Music</option>
                            <option value="Academics">Academics</option>
                            <option value="Technology">Technology</option>
                            <option value="Career">Career</option>
                            <option value="Wellness">Wellness</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea
                            name="description"
                            placeholder="Describe what you'll teach"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label>Duration (optional)</label>
                            <input
                                type="text"
                                name="duration"
                                placeholder="e.g., 4 hours"
                                value={formData.duration}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Level</label>
                            <select name="level" value={formData.level} onChange={handleChange}>
                                <option>Beginner</option>
                                <option>Intermediate</option>
                                <option>Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.modalButtons}>
                        <button type="button" className={styles.cancelBtn} onClick={() => setIsOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.saveBtn}>
                            {apiStatus === apiProgress.loading
                                ? <TailSpin width={20} height={20} color="#fff" />
                                : "Edit Skill"
                            }
                        </button>
                    </div>
                </form>
            </CommonModal>
        </>
    )
}

export default EditSkillModal