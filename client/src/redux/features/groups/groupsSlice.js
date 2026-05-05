import { createSlice } from "@reduxjs/toolkit";
import { createGroup, fetchGroups } from "./groupsActions";

const initialState = {
    groups: [],
    createLoading: false,
    loading: false,
    error: null
}

const groupSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createGroup.pending, (state) => {
                state.createLoading = true
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.createLoading = false
            })
            .addCase(createGroup.rejected, (state, action) => {
                state.createLoading = false,
                    state.error = action.payload
            })

            .addCase(fetchGroups.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false
                state.groups = action.payload
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload
            })
    }
})

export default groupSlice.reducer