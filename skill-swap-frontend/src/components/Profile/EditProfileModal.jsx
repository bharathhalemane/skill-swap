import { useState, useEffect } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaCamera } from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import CommonModal from "../Utils/CommonModal";
import { toast } from "react-toastify";
const apiProgress = {
  loading: "LOADING",
  success: "SUCCESS"
};

const EditProfileModel = ({ profileDetails, onProfileUpdated }) => {

  const token = Cookies.get("jwtToken");
  const [isOpen, setIsOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState(apiProgress.success);
  const [preview, setPreview] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    location: "",
    bio: "",
    image: ""
  });

  // Sync when profileDetails changes
  useEffect(() => {
    if (profileDetails) {
      setPreview(profileDetails?.profile?.profileImage || null);
      setProfileData({
        name: profileDetails?.name || "",
        username: profileDetails?.profile?.username || "",
        location: profileDetails?.profile?.location || "",
        bio: profileDetails?.profile?.bio || "",
        image: ""
      });
    }
  }, [profileDetails]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setProfileData(prev => ({ ...prev, image: file }));
    }
  };

  const onSubmitProfileDetails = async (e) => {
    e.preventDefault();
    try {
      setApiStatus(apiProgress.loading);

      const url = `${import.meta.env.VITE_PROFILE_API}/profile-update`;
      const formData = new FormData();

      Object.keys(profileData).forEach(key => {
        if (profileData[key]) {
          formData.append(
            key === "image" ? "profile_image" : key,
            profileData[key]
          );
        }
      });

      await axios.put(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Hurry! your profile updated successfully.")
      setApiStatus(apiProgress.success);
      onProfileUpdated();
      setIsOpen(false);

    } catch (err) {
      setApiStatus(apiProgress.success)
      setIsOpen(false)
      toast.error("Oops! Something unexpect thing happened. Try Again!")
    }
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Edit Profile</button>

      <CommonModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile"
        width="550px"
      >
        <form className="profile-update-form" onSubmit={onSubmitProfileDetails}>

          <div className="profile-image-wrapper">
            <label className="avatar-container">
              {preview ? (
                <img src={preview} className="profile-selected-image" />
              ) : (
                <BsPersonCircle className="avatar-icon" />
              )}

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
            <input
              type="text"
              value={profileData.name}
              onChange={e =>
                setProfileData(prev => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={profileData.username}
              onChange={e =>
                setProfileData(prev => ({ ...prev, username: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={profileData.location}
              onChange={e =>
                setProfileData(prev => ({ ...prev, location: e.target.value }))
              }
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={profileData.bio}
              onChange={e =>
                setProfileData(prev => ({ ...prev, bio: e.target.value }))
              }
            />
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>

            <button type="submit" className="save-btn">
              {apiStatus === apiProgress.loading ? (
                <TailSpin width={20} height={20} color="#fff" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </form>
      </CommonModal>
    </>
  );
};

export default EditProfileModel;