import { useLocation, useNavigate } from "react-router-dom";
import HomeLayout from "../Layouts/HomeLayout";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addCourseLecture } from "../Redux/Slices/LectureSlice";
import { AiOutlineArrowLeft } from "react-icons/ai";

function AddLecture(){

    const courseDetails = useLocation().state;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    console.log('cid',courseDetails)

    const [userInput,setUserInput] = useState({
        id:courseDetails._id,
        lecture:undefined,
        title:"",
        description:"",
        videoSrc:"",
    })

    function handleInputChange(e){
        const {name,value} = e.target;
        setUserInput({
            ...userInput,
            [name]:value
        })
    }

    function handleVideo(e){
        const video = e.target.files[0];
        const source = window.URL.createObjectURL(video);
        console.log(source);
        setUserInput({
            ...userInput,
            lecture:video,
            videoSrc:source
        })
    }

    async function handleFormSubmit(e){
        e.preventDefault();

        if(!userInput.title || !userInput.description || !userInput.lecture){
            toast.error("All fields are mandatory!");
            return;
        }

        const response = await dispatch(addCourseLecture(userInput));
        if(response?.payload?.success){
            setUserInput({
                id:courseDetails._id,
                lecture:undefined,
                title:"",
                description:"",
                videoSrc:"",
            })

            navigate(-1);
        }

    }

    useEffect(()=>{
        if(!courseDetails) navigate('/course');
    },[])

    return(
        <HomeLayout>
            <div className=" min-h-[90vh] text-black flex flex-col items-center justify-center gap-10 mx-16 ">
                <div className=" flex flex-col gap-5 shadow-[0_0_10px_black] w-96 rounded-lg px-6 py-4">
                    <header className=" flex items-center justify-center relative">
                        <button className=" absolute left-2 text-xl text-green-500" onClick={()=>navigate(-1)}>
                            <AiOutlineArrowLeft />
                        </button>
                        <h1 className=" text-lg text-green-500 font-semibold">
                            Add New Lecture
                        </h1>
                    </header>

                    <form noValidate onSubmit={handleFormSubmit} className=" flex flex-col gap-3">
                        <input 
                            type="text"
                            name="title"
                            placeholder="Enter the name of Lecture"
                            onChange={handleInputChange}
                            value={userInput.title}
                            className=" bg-transparent px-3 py-1 border border-green-500 outline-none" />

                        <textarea 
                            name="description"
                            placeholder="Enter the description of Lecture"
                            onChange={handleInputChange}
                            value={userInput.description}
                            className=" bg-transparent px-3 py-1 border border-green-500 outline-none resize-none overflow-y-scroll h-36"
                        /> 

                        {
                            userInput.videoSrc ? (
                                <video 
                                    muted
                                    src={userInput.videoSrc}
                                    controls
                                    disablePictureInPicture
                                    controlsList="nodownload nofullscreen"
                                    className=" object-fill rounded-tl-lg rounded-tr-lg w-full"
                                />
                            ):
                            (
                            <div className=" h-48 flex items-center border border-green-500 justify-center cursor-pointer">
                                <label className=" font-semibold text-xl text-black cursor-pointer" htmlFor="lecture">Choose your video</label>
                                <input type="file" className="hidden" id="lecture" name="lecture" onChange={handleVideo} accept="video/mp4 video/x-mp4 video/*" />
                            </div>
                            )
                        }
                        <button type="submit" className="btn btn-primary py-1 font-semibold text-lg">
                            Add New Lecture
                        </button>
                    </form>

                </div>
            </div>
        </HomeLayout>
    )
}

export default AddLecture;