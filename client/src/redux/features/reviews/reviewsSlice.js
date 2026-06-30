import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    reviewed: {},
    teacherReviews: [],
    loading: false
}

const reviewsSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {
        setReviewed: (state, action) => {
            const { requestId, value } = action.payload
            state.reviewed[requestId] = value
        },
        setTeacherReviews: (state, action) => {
            state.teacherReviews = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const { setReviewed, setTeacherReviews, setLoading } = reviewsSlice.actions
export default reviewsSlice.reducer 