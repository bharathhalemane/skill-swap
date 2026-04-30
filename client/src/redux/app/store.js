import { configureStore } from "@reduxjs/toolkit"

import skillsReducer from "../features/skills/skillsSlice"
import comSkillsReducer from "../features/completedSkills/comSkillsSlice"
import profileReducer from "../features/profile/ProfileSlice"
import requestsReducer from "../features/requests/requestsSlice"
import teachingSkillsReducer from "../features/teachingSkills/teachingSkillsSlice"
const store = configureStore({
    reducer: {
        skills: skillsReducer,
        comSkills: comSkillsReducer,
        profile: profileReducer,
        requests: requestsReducer,
        teachingSkills: teachingSkillsReducer
    }
})

export default store