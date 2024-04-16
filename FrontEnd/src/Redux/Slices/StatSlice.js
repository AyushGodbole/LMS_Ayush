import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../Helper/axiosInstance";
import toast from "react-hot-toast";

const initialState = {
    totalSubscriptionsCount:0,
    allSubscriptionsCount:0
};


const statSlice = createSlice({
    name:'stat',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder.addCase(getStatsData.fulfilled,(state,action)=>{
            state.totalSubscriptionsCount = action?.payload?.totalSubscriptionsCount;
            state.allSubscriptionsCount = action?.payload?.allSubscriptionsCount
        })
    }
});


export const getStatsData = createAsyncThunk('/stats/get',async ()=>{
    try {
        const response = axiosInstance.get('/admin/stats/users');
        toast.promise(response,{
            loading:'Getting users Stats ...',
            success:"Stats loaded successfully",
            error:'Failed to load stats'
        })

        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
})


export default statSlice.reducer;