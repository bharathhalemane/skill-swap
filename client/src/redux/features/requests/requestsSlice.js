import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sentRequest: {},
    receivedRequest: [],
    loading: false,
    error: null
}

const requestsSlice = createSlice({
    name: "requests",
    initialState,
    reducers: {
        fetchRequestStart: (state, action) => {
            state.loading = true
            state.error = null
        },
        fetchRequestFailure: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        fetchReceivedRequestSuccess: (state, action) => {
            state.loading = false 
            state.error = null 
            state.receivedRequest = action.payload
        }
    }
})

export const {
    fetchRequestFailure,
    fetchRequestStart,
    fetchReceivedRequestSuccess
} = requestsSlice.actions

export default requestsSlice.reducer