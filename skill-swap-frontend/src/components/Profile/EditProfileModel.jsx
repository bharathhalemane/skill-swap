import {useState} from "react";
import ReactModal from "react-modal";
import { BsPersonCircle } from "react-icons/bs";
import { FaCamera } from "react-icons/fa";
ReactModal.setAppElement("#root");

const EditProfileModel = () =>{
  const [isOpen, setIsOpen] = useState(false)
  
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

            <form className="profile-update-form">

            {/* Profile Image Section */}
            <div className="profile-image-wrapper">
                <label className="avatar-container">
                    <BsPersonCircle className="avatar-icon" />

                    <div className="camera-icon">
                    <FaCamera />
                    </div>

                    <input
                    type="file"
                    className="profile-image-input"
                    accept="image/*"
                    />
                </label>
            </div>

            <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="Name" />
            </div>

            <div className="form-group">
                <label>Username</label>
                <input type="text" placeholder="Username" />
            </div>

            <div className="form-group">
                <label>Location</label>
                <input type="text" placeholder="Location" />
            </div>

            <div className="form-group">
                <label>Bio</label>
                <textarea placeholder="Bio"></textarea>
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