import {configureStore} from "@reduxjs/toolkit"

import skillsReducer from "../features/skills/skillsSlice"
import comSkillsReducer from "../features/completedSkills/comSkillsSlice"
import profileReducer from "../features/profile/ProfileSlice"
const store = configureStore({
    reducer: {
        skills: skillsReducer,
        comSkills: comSkillsReducer,
        profile: profileReducer
    }
})

export default store