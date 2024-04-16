import { createAsyncThunk,createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast";
import axiosInstance from "../../Helper/axiosInstance";

const initialState = {
    courseData:[],
}

export const getAllCourses = createAsyncThunk('/course/get',async()=>{
    try {
        const response = axiosInstance.get('/course');
        toast.promise(response,{
            loading:'loading course data...',
            success:'course loaded successfully',
            error:'failed to fetch course details!'
        })
        return (await response).data.courses
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const deleteCourse = createAsyncThunk('/course/delete',async(id)=>{
    try {
        const response = axiosInstance.delete(`/course/${id}`);
        toast.promise(response,{
            loading:'deleting the course ...',
            success:'course deleted successfully',
            error:'failed to delete course!'
        })
        return (await response).data.courses
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const createNewCourse = createAsyncThunk('/course/create', async (data) => {
    try {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('category', data.category);
        formData.append('createdBy', data.createdBy);
        formData.append('thumbNail', data.thumbNail);

        console.log('formData',formData)

        // sending to backend url
        const response = axiosInstance.post('/course', formData);
        toast.promise(response, {
            loading: 'Creating new course',
            success: 'Course created successfully',
            error: 'Failed to create course!',
        });

        return (await response).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
});

export const getSearchValue = createAsyncThunk('/course/search',async()=>{
    try {
        const response = axiosInstance.get('/course');
        return (await response).data.courses
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})


const courseSlice = createSlice({
    name:'course',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(getAllCourses.fulfilled,(state,action)=>{
            console.log(action.payload)
            state.courseData = [...action?.payload];
        })
        .addCase(getSearchValue.fulfilled,(state,action)=>{

        })
    }
});

export default courseSlice.reducer;