import axios from "axios"

import { fetchSkillsFailure, fetchSkillsSuccess, fetchSkillsStart } from "./skillsSlice"

export const fetchSkills = () => async (dispatch, getState) => {
    try {
        dispatch(fetchSkillsStart)
        const { page, filters } = getState().skills
        const url = `${import.meta.env.VITE_BACKEND_API}/skills?category=${filters.category}&level=${filters.level}&title=${filters.inputValue}&page=${page}&limit=${filters.limit}`
        const response = await axios.get(url)
        const hasMore = page * filters.limit > response.data.totalSkills
        const formattedSkills = response.data.skills.map(skill => ({
            id: skill._id,
            title: skill.title,
            description: skill.description,
            duration: skill.duration,
            imageUrl: skill.imageUrl,
            category: skill.category,
            level: skill.level,
            user: {
                name: skill.user.name,
                profileImage: skill.user.profile?.profile_image,
                userId: skill.user._id
            }
        }))
        dispatch(
            fetchSkillsSuccess({
                skills:formattedSkills,
                hasMore: hasMore
            })
        )
    } catch (err) {
        dispatch(fetchSkillsFailure(err.message))
    }
}