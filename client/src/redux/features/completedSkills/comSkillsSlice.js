import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    completedSkills: {},
    loading: false,
    error: null
}

const comSkillsSlice = createSlice({
    name: "comSkills",
    initialState,
    reducers: {
        fetchCompletedSkills: (state, action) => {
            state.completedSkills = action.payload
        },
        fetchSkillStart: (state) => {
            state.loading = true 
            state.error = null
        },
        fetchSkillsSuccess: (state, action) => {
            state.loading = false 
            state.error = action.payload
        },
        fetchSkillsFailure : (state, action) => {
            state.loading = false 
            state.error = action.payload
        }
    }
})

export const {
    fetchCompletedSkills,
    fetchSkillStart,
    fetchSkillsFailure,
    fetchSkillsSuccess
} = comSkillsSlice.actions 

export default comSkillsSlice.reducer

