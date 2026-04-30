import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    profileImage: "",
    profile: {},
    loading: false,
    error: null
}

const ProfileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        fetchProfileStart: (state) => {
            state.loading = true
            state.error = null
        },
        
        fetchProfileFailure : (state, action) => {
            state.loading = false 
            state.error = action.payload 
        },
        fetchProfile: (state, action) => {
            state.profileImage = action.payload.profile.profileImage
            state.profile = action.payload
            state.loading = false 
            state.error = null
        },
    }
})

export const {
    fetchProfile,
    fetchProfileStart,
    fetchProfileFailure,
} = ProfileSlice.actions

export default ProfileSlice.reducer