import {createSlice} from "@reduxjs/toolkit"

const getLimit = () => {
    if (typeof window === "undefined") return 8;
    if (window.innerWidth <= 768) return 4;
    if (window.innerWidth <= 1024) return 6;
    return 8;
};

const initialState = {
    skills: [],
    loading: false,
    error: null,
    page: 1,
    hasMore: true,
    totalSkills:0,
    filters: {
        category: "all",
        level: "",
        inputValue: "",
        limit: getLimit()
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
            state.totalSkills = action.payload.totalSkills 
            state.hasMore = action.payload.hasMore
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
        },

        setLimit: (state, action) => {
            state.filters.limit = action.payload
        },
        setLevel: (state, action) => {
            state.filters.level = action.payload
        },

        setPage: (state, action) => {
            state.page = action.payload
        }
    }
})

export const {
    fetchSkillsFailure,
    fetchSkillsStart,
    fetchSkillsSuccess,
    resetSkills,
    setCategory,
    setSearch,
    setLimit,
    setLevel,
    setPage
} = skillsSlice.actions 

export default skillsSlice.reducer