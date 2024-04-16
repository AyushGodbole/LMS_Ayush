import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import HomeLayout from "../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { cancelCourseBundle } from "../Redux/Slices/RazorpaySlice";
import { getUserDetails } from "../Redux/Slices/Authslice";
import toast from "react-hot-toast";

function UserProfile(){

    const userData = useSelector((state)=>state?.auth?.data);
    console.log('mydata',userData);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleCancelSubsciption(){
        await dispatch(cancelCourseBundle());
        await dispatch(getUserDetails())
        toast.success("Cancellation completed");
        navigate('/');
    }

    return (
        <HomeLayout>
            <div className="min-h-[90vh] flex items-center justify-center">
                <div className="my-10 flex flex-col gap-4 rounded-lg p-5 text-black shadow-[0_0_10px_black] w-[35vw]">
                    <img src={userData?.avatar.secure_url} 
                         alt="profie-image"
                         className="w-40 m-auto rounded-full border border-black" 
                    />

                    <h3 className="text-xl text-center font-semibold capitalize">
                        {userData?.full_name}
                    </h3>

                    <div className="grid grid-cols-2">
                        <p>Email : </p>
                        <p>{userData?.email}</p>

                        <p>Role :</p>
                        <p>{userData?.role}</p>

                        <p>Subscription :</p>
                        <p>{userData?.subscription.status==='active'?'Active':'Inactive'}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <Link to='/changepassword' className='w-1/2 text-white bg-green-600 hover:bg-green-500 transition-all ease-in-out duration-300 rounded-sm font-semibold cursor-pointer p-3 text-center'>
                            <button>Change Password</button>
                        </Link>

                        <Link to='/user/editprofile' className='w-1/2 text-white bg-green-600 hover:bg-green-500 transition-all ease-in-out duration-300 rounded-sm font-semibold cursor-pointer p-3 text-center'>
                            <button>Edit Profile</button>
                        </Link>
                    </div>
                    
                    {console.log('pika',userData.subscription)}

                    {userData?.subscription.status==='active' && (
                        <button onClick={handleCancelSubsciption} className="w-full  bg-red-600 hover:bg-red-500 transition-all ease-in-out duration-300 rounded-sm font-semibold cursor-pointer p-3 text-center">
                            Cancel Subscription
                        </button>
                    )}
                </div>
            </div>
        </HomeLayout>
    )
}

export default UserProfile;