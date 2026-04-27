import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    profileImage: ""
}

const ProfileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        fetchProfile: (state, action) => {
            state.profileImage = action.payload.profile_image
        }
    }
})

export const {
    fetchProfile
} = ProfileSlice.actions

export default ProfileSlice.reducer