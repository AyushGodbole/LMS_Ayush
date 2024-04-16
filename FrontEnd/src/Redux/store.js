// this store.js is used to keep multiple reducers together.

import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/Authslice'
import courseSliceReducer from "./Slices/CourseSlice";
import razorpaySliceReducer from './Slices/RazorpaySlice';
import lectureSliceReducer from "./Slices/LectureSlice";
import statSliceReducer from "./Slices/StatSlice";

// creating store
const store = configureStore({
    reducer:{
        auth : authSliceReducer,
        course:courseSliceReducer,
        razorpay:razorpaySliceReducer,
        lecture : lectureSliceReducer,
        stat:statSliceReducer,
    },
    devTools:true
});

export default store;