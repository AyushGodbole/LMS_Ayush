// Slices take name of slice , initial state , reducers of that slice which can be used anywhere
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from '../../Helper/axiosInstance'

// defining initial state
const initialState = {
    isLoggedIn : localStorage.getItem('isLoggedIn')||false,
    role : localStorage.getItem('role')||"",
    data : localStorage.getItem('data') ? JSON.parse(localStorage.getItem('data')) : {}
}

export const createUserAccount = createAsyncThunk('/auth/signup',async (data)=>{
    try {
        const res = axiosInstance.post('/user/register',data);

        toast.promise(res,{
            loading:'wait! creating your account',
            success:(data)=>{
                return data?.data?.message;
            },
            error:'failed to create account'
        })

        return (await res).data

    } catch (error) {
        toast.error(error?.response?.message);
    }
});

export const login = createAsyncThunk('/auth/login',async (data)=>{
    try {
        const res = axiosInstance.post('/user/login',data);

        toast.promise(res,{
            loading:'wait! authentication in process',
            success:(data)=>{
                return data?.data?.message;
            },
            error:'failed to login!'
        })

        return (await res).data

    } catch (error) {
        toast.error(error?.response?.message);
    }
})

export const logOut = createAsyncThunk('/auth/logout',async ()=>{
    try {
        const res = axiosInstance.get('/user/logout');

        toast.promise(res,{
            loading:'logging out',
            success:(data)=>{
                return data?.data?.message;
            },
            error:'failed to log-out!'
        })

        return (await res).data
    } catch (error) {
        toast.error(error?.response?.message);
    }
})

export const updateProfile = createAsyncThunk('/auth/update/profile',async (data)=>{
    try {
        // console.log(data[0]," and ",data[1]);
        // console.log('data obtained is ',data)
        // console.log('lala',JSON.parse(data));
        const res = axiosInstance.put(`/user/update/${data[0]}`,data[1]);

        toast.promise(res,{
            loading:'wait update in process!',
            success:(data)=>{
                return data?.data?.message;
            },
            error:'failed to update profile!'
        })

        return (await res).data
    } catch (error) {
        toast.error(error?.response?.message);
    }
})

export const getUserDetails = createAsyncThunk('/auth/details',async ()=>{
    try {
        const res = axiosInstance.get(`/user/me`);
        return (await res).data
    } catch (error) {
        toast.error(error.message);
    }
})

export const contact = createAsyncThunk('/feedback/contact',async(data)=>{
    try {
        const response = axiosInstance.post('/user/contact',data);
        
        toast.promise(response,{
            loading:'Submitting your message',
            success:(data)=>{
                return data?.data?.message;
            },
            error:'Failed to send message'
        })

        return (await response).data
    } catch (error) {
        toast.error("Operation Failed!",error);
    }
})

// creating authSlice
const authSlice = createSlice({
    // giving name to the slice
    name:'auth',

    // what is initial state
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(login.fulfilled,(state,action)=>{
            // console.log('DATA',action)
            // console.log('aghagga',JSON.stringify(action?.payload?.data));
            const obtainedData = JSON.stringify(action?.payload?.data)
            console.log('state of login',action)
            localStorage.setItem('data',obtainedData);
            localStorage.setItem('isLoggedIn',true);
            localStorage.setItem('role',action?.payload?.data?.role);
            state.data=action?.payload?.data;
            state.isLoggedIn=true
            state.role=action?.payload?.data?.role
        })
        .addCase(logOut.fulfilled,(state)=>{
            localStorage.clear()
            state.data = {};
            state.isLoggedIn = false;
            state.role = "";
        })
        .addCase(getUserDetails.fulfilled,(state,action)=>{
            if(!action?.payload?.data) return
            const obtainedData = JSON.stringify(action?.payload?.data)
            localStorage.setItem('data',obtainedData);
            localStorage.setItem('isLoggedIn',true);
            localStorage.setItem('role',action?.payload?.data?.role);
            state.data=action?.payload?.data;
            state.isLoggedIn=true
            state.role=action?.payload?.data?.role
            // console.log('temp',action.payload.data);
        })
    }
})

// export const {} = authSlice.actions;
export default authSlice.reducer;