import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"
import Cookies from "js-cookie"

const API = import.meta.env.VITE_BACKEND_API 

export const fetchCreatedContent = createAsyncThunk(
    "createdContent/fetchCreatedContent",
    async (userId, thunkAPI) => {
        try {
            const token = Cookies.get("jwtToken")
            
            const response = await axios.get(
                `${API}/profile/${userId}/created-content`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            console.log(response)
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch created content")
        }
    }
)

const createdContentSlice = createSlice({
    name: "createdContent",
    initialState: {
        skills: [],
        groups: [],
        loading: false,
        error: null
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchCreatedContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCreatedContent.fulfilled, (state, action) => {
                state.loading = false;
                state.skills = action.payload.skills || [];
                state.groups = action.payload.groups || [];
            })
            .addCase(fetchCreatedContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default createdContentSlice.reducer