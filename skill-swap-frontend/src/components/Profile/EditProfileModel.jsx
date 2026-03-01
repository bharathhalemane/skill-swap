import { useState, useEffect } from "react";
import ReactModal from "react-modal";
import { BsPersonCircle } from "react-icons/bs";
import { FaCamera } from "react-icons/fa";
ReactModal.setAppElement("#root");
import Cookies from "js-cookie"
import axios from "axios"

const EditProfileModel = () => {
  const token = Cookies.get("jwtToken")
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState(null)
  const [profileData, setProfileData] = useState({
    name: "",
    userName: "",
    location: "",
    bio: "",
    image: ""
  })
  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setProfileData(prevState => ({ ...prevState, image: file }))
    }
  }

  const onSubmitProfileDetails = async (e) => {
    e.preventDefault()
    try {
      const url = `${import.meta.env.VITE_PROFILE_API}/profile-update`
      const formData = new FormData()

      formData.append("name", profileData.name)
      formData.append("userName", profileData.userName)
      formData.append("location", profileData.location)
      formData.append("bio", profileData.bio)
      if (profileData.image) {
        formData.append("profileImage", profileData.image) // real File object
      }

      await axios.put(
        url,
        formData, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setIsOpen(false)
    } catch (err) {
      console.log("FULL ERROR:", err.response?.data)
    }
  }


  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Edit Profile</button>

      <ReactModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        shouldCloseOnOverlayClick={true}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          },
          content: {
            position: "relative",
            inset: "auto",
            width: "400px",
            padding: "30px",
            borderRadius: "12px",
            border: "none"
          }
        }}
      >
        <h3 className="modal-title">Edit Profile</h3>

        <form className="profile-update-form" onSubmit={onSubmitProfileDetails}>

          {/* Profile Image Section */}
          <div className="profile-image-wrapper">
            <label className="avatar-container">
              <div>{preview ? <img src={preview} className="profile-selected-image" /> : <BsPersonCircle className="avatar-icon" />}</div>

              <div className="camera-icon">
                <FaCamera />
              </div>

              <input
                type="file"
                className="profile-image-input"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input type="text" placeholder="Name" value={profileData.name} onChange={e => setProfileData(prevState => ({ ...prevState, name: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Username" value={profileData.userName} onChange={e => setProfileData(prevState => ({ ...prevState, userName: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" placeholder="Location" value={profileData.location} onChange={e => setProfileData(prevState => ({ ...prevState, location: e.target.value }))} />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea placeholder="Bio" value={profileData.bio} onChange={e => setProfileData(prevState => ({ ...prevState, bio: e.target.value }))}></textarea>
          </div>

          <div className="modal-buttons">
            <button type="button" className="cancel-btn" onClick={() => setIsOpen(false)}>
              Cancel
            </button>

            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>

        </form>
      </ReactModal>
    </div>
  );
}

export default EditProfileModel