import {configureStore} from "@reduxjs/toolkit"

import skillsReducer from "../features/skills/skillsSlice"
import comSkillsReducer from "../features/completedSkills/comSkillsSlice"
const store = configureStore({
    reducer: {
        skills: skillsReducer,
        comSkills: comSkillsReducer
    }
})

export default store