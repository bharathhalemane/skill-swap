import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import CommonModal from "../../Utils/CommonModal";
import styles from './Modal.module.css'
const apiProgress = {
  loading: "LOADING",
  success: "SUCCESS"
};

const CreateSkillModal = ({buttonTitle, setChanges}) => {
  const token = Cookies.get("jwtToken");
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState(apiProgress.success);
  const [preview, setPreview] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    duration: "",
    level: "Beginner",
    image: null
  })

  const handleChange = e => {
    setFormData(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setFormData(prev => ({
        ...prev, image: file
      }))
    }
  }

  const postSkill = async () => {
    try {
      setApiStatus(apiProgress.loading)

      const data = new FormData()
      data.append("title", formData.title)
      data.append("category", formData.category)
      data.append("description", formData.description)
      data.append("duration", formData.duration)
      data.append("level", formData.level)
      data.append("image", formData.image)

      const url = `${import.meta.env.VITE_SKILL_API}/add-skill`
      console.log(url)
      const response = await axios.post(url, data,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setFormData({
        title: "",
        category: "",
        description: "",
        duration: "",
        level: "Beginner",
        image: null
      })
      setPreview(null)
      setApiStatus(apiProgress.success)
      setChanges(true)
      setIsOpen(false)
    }catch(err){
      console.log(err)
      setIsOpen(false)
    }
  }

  const onSubmit = e => {
    e.preventDefault()
    postSkill()
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="create-skill-button">+ {buttonTitle}</button>

      <CommonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Skill To Teach"
        width="550px"
      >
        <form className={styles.modernForm} onSubmit={onSubmit}>

          <div className={styles.imageUploadWrapper}>
            <label htmlFor="" className={styles.imageUploadContainer}>
              {
                preview ? (
                  <img src={preview} alt="preview" className={styles.uploadedImage}/>
                ): (
                    <div className={styles.imagePlaceholder}>Upload Image</div>
                )
              }

              <input type="file" accept="image/*" name="image" className={styles.fileInput} onChange={handleImageChange} required/>
            </label>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="">Skill Title</label>
            <input type="text" name="title" placeholder="e.g., Web Development with React"
              value={formData.title}
              onChange={handleChange}
            required/>            
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="">Category</label>
            <select name="category" id="" value={formData.category} onChange={handleChange} required>
              <option value="">Select a category</option>
              <option value="Languages">Languages</option>
              <option value="Sports">Sports</option>
              <option value="Design">Design</option>
              <option value="Music">Music</option>
              <option value="Academics">Academics</option>
              <option value="Technology">Technology</option>
              <option value="Career">Career</option>
              <option value="Wellness">Wellness</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="">Description</label>
            <textarea name="description" id="" placeholder="Describe what you'll teach" value={formData.description} onChange={handleChange} required></textarea>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="">Duration (optional)</label>
              <input type="text" name="duration" placeholder="e.g., 4 hours" value={formData.duration} onChange={handleChange}/>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="">Level</label>
              <select name="level" id="" value={formData.level} onChange={handleChange}
              required>
                <option>Beginner</option>
                <option >Intermediate</option>
                <option >Advanced</option>
              </select>
            </div>
          </div>
          <div className={styles.modalButtons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>

            <button type="submit" className={styles.saveBtn}>
              {apiStatus === apiProgress.loading ? (
                <TailSpin width={20} height={20} color="#fff" />
              ) : (
                buttonTitle
              )}
            </button>
          </div>

        </form>
      </CommonModal>
    </>
  );
};

export default CreateSkillModal;