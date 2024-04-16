import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../Helper/axiosInstance"
import toast from "react-hot-toast";

const initialState = {
    key:"",
    subscription_id:"",
    isPaymentVerified:false,
    allPayments:{},
    finalMonth:{},
    monthlySalesRecord:[]
}

export const getRazorpayId = createAsyncThunk('/razorpay/getId',async ()=>{
    try {
        const response = await axiosInstance.get('/payments/getRazorpayApiKey');
        console.log("mykey",response.data.key);
        return response.data;
    } catch (error) {
        toast.error('Failed to load Data!');
    }
})

export const purchaseCourseBundle = createAsyncThunk('/purchaseCourse', async () => {
    try {
        const response = await axiosInstance.post('/payments/subscribe');
        console.log('ini',response);
        return response.data;
    } catch (error) {
        console.error("Error in purchaseCourseBundle:", error);
        toast.error("Loading failed for bundle");
        throw error; // Rethrow the error to handle it in the component.
    }
});

export const verifyPayment = createAsyncThunk('payment/verify',async (data)=>{
    try {
        const response = await axiosInstance.post('/payments/verify',{
            razorpay_payment_id : data.razorpay_payment_id,
            razorpay_subscription_id : data.razorpay_subscription_id,
            razorpay_signature : data.razorpay_signature
        });
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const getPaymentRecord = createAsyncThunk('payment/record',async ()=>{
    try {
        const response =  axiosInstance.get('/payments?count=100');
        toast.promise(response,{
            loading:'getting payment record',
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to get payment records!",
            // continue from 7 minutes
        })

        console.log('payement records',response)
        return (await response).data
    } catch (error) {
        toast.error("Operation Failed!");
    }
})

export const cancelCourseBundle = createAsyncThunk('payment/cancel',async ()=>{
    try {
        const response =  axiosInstance.post('/payments/unsubscribe');
        toast.promise(response,{
            loading:'unsubscribing please wait!',
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to unsubscribe!",
            // continue from 7 minutes
        })
        return (await response).data
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

const razorpaySlice = createSlice({
    name:'razorpay',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder
        .addCase(getRazorpayId.fulfilled,(state,action)=>{
            state.key = action?.payload?.key;
        })
        .addCase(purchaseCourseBundle.fulfilled,(state,action)=>{
            // console.log(action?.payload?.subscription_id);
            state.subscription_id = action?.payload?.subscription_id;
        })
        .addCase(verifyPayment.fulfilled,(state,action)=>{
            toast.success(action?.payload?.message);
            state.isPaymentVerified = action?.payload?.success;
        })
        .addCase(verifyPayment.rejected,(state,action)=>{
            toast.success(action?.payload?.message);
            state.isPaymentVerified = action?.payload?.success;
        })
        .addCase(getPaymentRecord.fulfilled,(state,action)=>{
            console.log('actions',action?.payload)
            state.allPayments = action?.payload?.allSubscriptions;
            state.finalMonth = action?.payload?.finalMonth;
            state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
        })
    }
})

export default razorpaySlice.reducer;