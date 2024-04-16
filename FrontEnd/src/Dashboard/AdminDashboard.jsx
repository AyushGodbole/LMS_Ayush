import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../Layouts/HomeLayout";
import { Chart , ArcElement , Tooltip , Legend , CategoryScale , LinearScale , BarElement , Title } from "chart.js";
import { useNavigate } from "react-router-dom";
import { deleteCourse, getAllCourses } from "../Redux/Slices/CourseSlice";
import { getStatsData } from "../Redux/Slices/StatSlice";
import { getPaymentRecord } from "../Redux/Slices/RazorpaySlice";
import { useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {FaUsers} from 'react-icons/fa'
import {FcSalesPerformance} from 'react-icons/fc'

// registering chart objects
Chart.register(ArcElement,Tooltip,Legend,CategoryScale,LinearScale,BarElement,Title)

function AdminDashboard(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {totalSubscriptionsCount,allSubscriptionsCount} = useSelector((state)=>state?.stat);
    const {allPayments,finalMonth,monthlySalesRecord} = useSelector((state)=>state?.razorpay);

    async function load(){
        await dispatch(getAllCourses());
        await dispatch(getPaymentRecord());
        await dispatch(getStatsData());

        // console.log('p dhf',allPayments,finalMonth,monthlySalesRecord)
    }

    const userData = {
        labels:["Registered user","Enrolled user"],
        fontColor:'white',
        datasets:[
            {
                label:"User Details",
                data:[totalSubscriptionsCount,allSubscriptionsCount],
                backgroundColor:['yellow','green'],
                borderWidth:1,
                borderColor:['yellow','green']
            }
        ]
    }

    const salesData = {
        labels:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        fontColor:'white',
        datasets:[
            {
                label:'Sales / Month',
                data:monthlySalesRecord,
                backgroundColor:'rgb(255,99,132)',
                borderColor:'white',
                borderWidth:2
            }
        ]
    }

    const myCourses = useSelector((state)=>state?.course?.courseData)

    async function onCourseDelete(id){
        if(window.confirm("Are you sure you want to delete course ?")){
            const response = await dispatch(deleteCourse(id))

            if(response?.payload?.success){
                await dispatch(getAllCourses())
            }
        }
    }

    useEffect(()=>{
        load()
    },[])

    return(
        <HomeLayout>
            <div className=" min-h-[90vh] pt-5 flex flex-col flex-wrap gap-10 text-black">
                <h1 className=" text-center text-5xl text-green-500 font-semibold">
                    Admin Dashboard
                </h1>

                <div className=" grid grid-cols-2 gap-5 m-auto mx-10">
                    <div className=" flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                        <div className="w-80 h-80">
                            <Pie data={userData} />
                        </div> 

                        <div className=" grid grid-cols-2 gap-5">
                            {/* total subscribed users */}
                            <div className=" flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                                <div className=" flex flex-col items-center">
                                    <p className=" font-semibold">Total users</p>
                                    <h1 className=" text-4xl font-bold">{totalSubscriptionsCount}</h1>
                                </div>
                                <FaUsers className=" text-5xl text-green-500"/>
                            </div>

                            {/* Enrolled users */}
                            <div className=" flex items-center justify-between p-5 gap-5 rounded-md shadow-md">
                                <div className=" flex flex-col items-center">
                                    <p className=" font-semibold">Enrolled users</p>
                                    <h1 className=" text-4xl font-bold">{allSubscriptionsCount}</h1>
                                </div>
                                <FaUsers className=" text-5xl text-green-500"/>
                            </div>
                        </div>                       
                    </div>

                    <div className=" flex flex-col items-center gap-10 p-5 shadow-lg rounded-md">
                        <div className=" h-80 w-full relative">
                            <Bar className=" absolute bottom-0 h-80 w-full" data={salesData}/>
                        </div>

                        <div className=" grid grid-cols-2 gap-5">
                                <div className=" flex flex-col items-center">
                                    <p className=" font-semibold">Subscription count</p>
                                    {console.log('payment counts',allPayments)}
                                    <h1 className=" text-4xl font-bold">{allPayments?.count}</h1>
                                </div>
                                <FcSalesPerformance className=" text-5xl text-green-500"/>
                        </div>
                    </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default AdminDashboard;