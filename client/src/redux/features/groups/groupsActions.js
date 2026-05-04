import { createAsyncThunk } from "@reduxjs/toolkit";
import { createGroupApi, fetchGroupsApi } from "./groupsService";

export const createGroup = createAsyncThunk(
    "groups/create",
    async (data, { rejectWithValue }) => {
        try {
            return await createGroupApi(data)
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Error")
        }
    }
)

export const fetchGroups = createAsyncThunk(
    "groups/fetchAll",
    async (__dirname, { rejectWithValue }) => {
        try {
            return await fetchGroupsApi() 
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Error")
        }
    }
)