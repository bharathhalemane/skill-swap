import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    learningSkills : []
}

const learningSkillsSlice = createSlice({
    name: "learningSkills",
    initialState,
    reducers: {
        updateLearningSkills :(state, action) => {
            state.learningSkills = action.payload
        }
    }
})

export const {
    updateLearningSkills
} = learningSkillsSlice.actions

export default learningSkillsSlice.reducer