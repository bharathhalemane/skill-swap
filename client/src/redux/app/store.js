import { configureStore } from "@reduxjs/toolkit"

import skillsReducer from "../features/skills/skillsSlice"
import comSkillsReducer from "../features/completedSkills/comSkillsSlice"
import profileReducer from "../features/profile/ProfileSlice"
import requestsReducer from "../features/requests/requestsSlice"
import teachingSkillsReducer from "../features/teachingSkills/teachingSkillsSlice"
import scheduleAndAvailabilityReducer from "../features/scheduleAndAvailability/scheduleAndAvailabilitySlice"
import learningSkillsReducer from "../features/learningSkills/learningSkillsSlice"
import groupReducer from "../features/groups/groupsSlice"
import createdContentReducer from "../features/creations/createdContentSlice"

const store = configureStore({
    reducer: {
        skills: skillsReducer,
        comSkills: comSkillsReducer,
        profile: profileReducer,
        requests: requestsReducer,
        teachingSkills: teachingSkillsReducer,
        scheduleAndAvailability: scheduleAndAvailabilityReducer,
        learningSkills: learningSkillsReducer,
        groups: groupReducer,
        createdContent: createdContentReducer
    }
})

export default store