import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../Layouts/HomeLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteCourseLecture, getCourseLecture } from "../Redux/Slices/LectureSlice";

function DisplayLectures(){

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {state} = useLocation();

    // console.log('hdhdh',state)
    const {lectures} = useSelector((state)=>state?.lecture);
    const {role} = useSelector((state)=>state?.auth);

    const [currentVideo,setCurrentVideo] = useState(0);

    console.log('lecturesssss',lectures)

    async function onLectureDelete(courseId,lectureId){
        console.log(courseId,lectureId);
        await dispatch(deleteCourseLecture({courseId,lectureId}));
        const res = await dispatch(getCourseLecture(courseId));

        if(res){
            navigate('/course/displayLectures');
        }
    }

    useEffect(()=>{
        if(!state) navigate('/courses');

        dispatch(getCourseLecture(state?._id));
        console.log('state',state);
        console.log('lectures',lectures);
    },[])

    return(
        <HomeLayout>
            <div className=" flex flex-col gap-10 items-center justify-center py-10 min-h-[90vh] text-black mx-4">
                <div className=" text-center text-2xl font-semibold text-green-500">
                    Course Name : {state?.title}
                </div>

                <div className=" flex justify-center w-full gap-10">
                    {/* left section for videos */}
                    <div className=" space-y-5 w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black]">
                        <video 
                        src={lectures && lectures[currentVideo]?.lecture.secure_url} 
                        className=" object-fill rounded-tl-lg rounded-tr-lg w-full"
                        controls 
                        muted 
                        autoPlay
                        loop
                        disablePictureInPicture
                        controlsList="nodownload">
                        </video>

                        <div>
                            <h1>
                                <span className=" text-green-500 font-bold">
                                    Title : {" "}
                                </span>
                                {lectures && lectures[currentVideo]?.title}
                            </h1>

                            <p>
                                <span className=" text-green-500 font-bold">
                                    Description : {" "}
                                </span>
                                {lectures && lectures[currentVideo]?.description}
                            </p>
                        </div>
                    </div>

                    {/* right section for displaying list of lectures */}
                    <ul className=" w-[28rem] p-2 rounded-lg shadow-[0_0_10px_black] space-y-4">
                        <li className=" font-semibold text-xl text-green-500 flex items-center justify-between">
                            <p>Lecture list</p>
                            {role==='ADMIN' && (
                                <button onClick={()=>navigate('/course/addLecture',{state : {...state}})} className="btn-secondary px-2 py-1 rounded-md font-semibold text-sm">
                                    Add New Lecture
                                </button>
                            )}
                        </li>

                        {lectures && lectures.map((lecture,idx)=>{
                            return(
                                <li key={lecture.lecture_id}>
                                    <p className=" cursor-pointer py-3" onClick={()=>{setCurrentVideo(idx)}}>
                                        <span>
                                            {" "} Lecture {idx+1} : {" "}
                                        </span>
                                        {lecture?.title}
                                        {/* {console.log(state?._id,lecture?._id)} */}
                                    </p>
                                    {role==='ADMIN' &&
                                        <button onClick={()=>{onLectureDelete(state?._id,lecture?._id)}} className=" btn-accent px-2 py-1 rounded-md font-semibold text-sm">
                                            Remove Lecture
                                        </button>}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </HomeLayout>
    )
}

export default DisplayLectures;