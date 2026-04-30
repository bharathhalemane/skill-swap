import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    schedule: [],
    availability: [],
    titles: []
}

const scheduleAndAvailabilitySlice = createSlice({
    name: "scheduleAndAvailability",
    initialState,
    reducers: {
        updateScheduleData: (state, action) => {
            state.schedule = action.payload
        },
        updateAvailabilityData: (state, action) => {
            state.availability = action.payload
        },
        updateTitles: (state, action) => {
            state.titles = action.payload
        }
    }
})

export const {
    updateScheduleData,
    updateAvailabilityData,
    updateTitles
} = scheduleAndAvailabilitySlice.actions

export default scheduleAndAvailabilitySlice.reducer