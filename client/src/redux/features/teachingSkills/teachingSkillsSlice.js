import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    teachingSkills: [],
    page: 1,
    totalSkills: 0
}

const teachingSkillsSlice = createSlice({
    name: "teachingSkills",
    initialState,
    reducers: {
        fetchTeachingSkills: (state, action) => {
            state.teachingSkills = action.payload.skills
            state.totalSkills = action.payload.totalSkills
        },
        setPage: (state, action) => {
            state.page = action.payload
        }
    }
})

export const {
    fetchTeachingSkills,
    setPage
} = teachingSkillsSlice.actions

export default teachingSkillsSlice.reducer