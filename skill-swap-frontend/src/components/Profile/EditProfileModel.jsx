import {useState} from "react";
import ReactModal from "react-modal";
import { BsPersonCircle } from "react-icons/bs";
import { FaCamera } from "react-icons/fa";
ReactModal.setAppElement("#root");

const EditProfileModel = () =>{
  const [isOpen, setIsOpen] = useState(false)  
  const [profileData, setProfileData] = useState({
    name:"",
    username:"",
    location:"",
    bio:"",
    image:""
  })

  const handleImageChange = e => {
    const file = e.target.files[0]
    if(file) {
      const imageUrl = URL.createObjectURL(file)
      setProfileData(prevState => ({...prevState, image: imageUrl}))
    }
  }

  const onSubmitProfileDetails = e => {
    e.preventDefault()     
    console.log(profileData)
  }
  
  
    return (
      <div>
        <button onClick={()=>setIsOpen(true)}>Edit Profile</button>

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
                <div>{profileData.image ? <img src={profileData.image} className="profile-selected-image"/> : <BsPersonCircle className="avatar-icon" />}</div>

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
          <input type="text" placeholder="Name" value={profileData.name} onChange={e => setProfileData(prevState => ({...prevState, name: e.target.value}))}/>
            </div>

            <div className="form-group">
                <label>Username</label>
              <input type="text" placeholder="Username" value={profileData.username} onChange={e => setProfileData(prevState => ({...prevState, username: e.target.value}))}/>
            </div>

            <div className="form-group">
                <label>Location</label>
              <input type="text" placeholder="Location" value={profileData.location} onChange={e => setProfileData(prevState => ({...prevState, location: e.target.value}))} />
            </div>

            <div className="form-group">
                <label>Bio</label>
              <textarea placeholder="Bio" value={profileData.bio} onChange={e => setProfileData(prevState => ({...prevState, bio: e.target.value}))}></textarea>
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