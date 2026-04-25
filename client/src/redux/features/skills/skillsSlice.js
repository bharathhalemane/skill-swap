import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    skills: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    filters: {
        category: "all",
        level: "",
        inputValue: "",
        limit: "8"
    }
}

const skillsSlice = createSlice({
    name: "skills",
    initialState,
    reducers: {
        fetchSkillsStart: (state) => {
            state.loading = true
            state.error = null
        },

        fetchSkillsSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.skills = action.payload.skills
            state.page += 1
        },
        
        fetchSkillsFailure : (state, action) => {
            state.loading = false 
            state.error = action.payload 
        },

        resetSkills: (state) => {
            state.skills = []
            state.page = 1
            state.hasMore=true
        },

        setCategory: (state, action) => {
            state.filters.category = action.payload
        },

        setSearch: (state, action) => {
            state.filters.inputValue = action.payload
        }
    }
})

export const {
    fetchSkillsFailure,
    fetchSkillsStart,
    fetchSkillsSuccess,
    resetSkills,
    setCategory,
    setSearch
} = skillsSlice.actions 

export default skillsSlice.reducer