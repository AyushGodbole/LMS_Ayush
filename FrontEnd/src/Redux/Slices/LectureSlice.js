import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helper/axiosInstance"

const initialState = {
    lectures:[],
}

export const getCourseLecture = createAsyncThunk('/course/lecture/get', async(courseId)=>{
    try {
        const response = axiosInstance.get(`/course/${courseId}`,{
            withCredentials:true
        });

        toast.promise(response,{
            loading:'Fetching Course Lectures',
            success: 'Lectures Fetched Successfully',
            error: 'Failed to Fetch Lectures'
        });

        console.log('res',(await response).data);
        return (await response).data;
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message);
    }
})


export const addCourseLecture = createAsyncThunk('/course/lecture/add', async(data)=>{

    console.log('out',data);
    const formData = new FormData();
    formData.append('lecture',data.lecture);
    formData.append('title',data.title);
    formData.append('description',data.description);

    try {
        const response =  axiosInstance.post(`/course/${data.id}`,formData);

        toast.promise(response,{
            loading:'Adding Course Lecture',
            success: 'Lecture Added Successfully',
            error: 'Failed to Add Lecture'
        });

        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const deleteCourseLecture = createAsyncThunk('/course/lecture/delete', async(data)=>{

    try {
        const response = axiosInstance.post(`/course/delete/lecture`,data);

        toast.promise(response,{
            loading:'Deleting Course Lecture',
            success: 'Lecture Deleted Successfully',
            error: 'Failed to Delete Lecture'
        });

        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

const lectureSlice = createSlice({
    name:'lecture',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getCourseLecture.fulfilled,(state,action)=>{
            console.log('state',state)
            console.log('action',action);
            state.lectures = action?.payload?.lectures;
        })
        .addCase(addCourseLecture.fulfilled,(state,action)=>{
            console.log(action);
            state.lectures = action?.payload?.lectureData
        })
        .addCase(deleteCourseLecture.fulfilled,(state,action)=>{
            state.lectures = action?.payload?.lectures;
        })
    }
})

export default lectureSlice.reducer;