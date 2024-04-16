import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../Layouts/HomeLayout";
import { useSelector } from "react-redux";
 
function CourseDescription(){
    // accepts data sended in useNavigate() method
    const {state} = useLocation();
    const navigate = useNavigate();

    // destructuring is done
    const {role,data} = useSelector((state)=>state?.auth);

    console.log('ayush',data,role,state)

    return (
        <HomeLayout>
            <div className="min-h-[90vh] pt-12 px-20 flex flex-col items-center justify-center text-black">
                <div className="grid grid-cols-2 gap-[5.5rem] relative pl-9">
                    <div className="space-y-5">  
                        <img src={state?.thumbNail.secure_url}

                        // for sql database
                        // <img src={state?.thumbNail_secure_url}
                             alt="thumnail"
                             className="w-full h-80" />              
                        <div className="space-y-4">
                            <div className="flex items-left flex-col text-xl">
                                <p className="font-semibold">
                                    <span className="text-green-500 font-bold">
                                        Total Lectures : {" "}
                                    </span>
                                    {state?.numberOfLectures}
                                </p>

                                <p className="font-semibold">
                                    <span className="text-green-500 font-bold">
                                        Instructor : {" "}
                                    </span>
                                    {state?.createdBy}
                                </p>
                            </div>

                            {/* for sql it is  data?.subscription_status*/}
                            { (role==='ADMIN' || data?.subscription?.status==='active') ? (
                                <button onClick={()=>navigate('/course/displayLectures',{state:{...state}})} className="bg-green-600 text-xl text-white rounded-md font-bold px-5 py-3 w-full hover:bg-green-500">Watch Lectures</button>
                            ):
                                <button onClick={()=>navigate('/checkout')} className="bg-green-600 text-xl text-white rounded-md font-bold px-5 py-3 w-full hover:bg-green-500">Subscribe</button>
                            }

                        </div>
                    </div>

                    <div className="space-y-2 text-xl">
                            <h1 className="text-3xl font-bold text-green-500 mb-5 text-center">
                                {state?.title}
                            </h1>

                            <p className=" text-green-500 font-semibold">
                                course description : {''}
                            </p>
                            <p>{state?.description}</p>
                        </div>
                </div>
            </div>
        </HomeLayout>
    )
}

export default CourseDescription;