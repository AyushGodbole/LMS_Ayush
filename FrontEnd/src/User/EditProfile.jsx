import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails, updateProfile } from "../Redux/Slices/Authslice";
import { Link, useNavigate } from "react-router-dom";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { AiOutlineArrowLeft } from "react-icons/ai";

function EditProfile(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userData,setUserData] = useState({
        previewImage : '',
        fullName : '',
        avatar_secure_url : undefined,
        userId : useSelector((state)=>state?.auth?.data?._id),
    })

    // console.log('neww',userData.userId);

    function handleImageUpload(e){
        e.preventDefault();
        const uploadedImage = e.target.files[0];

        if(uploadedImage){
            const fileReader = new FileReader();

            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener('load',function(){
                setUserData({
                    ...userData,
                    previewImage:this.result,
                    avatar_secure_url:uploadedImage,
                })
            })
        }
    }

    function handleInputChange(e){
        const {name,value} = e.target;
        setUserData({
            ...userData,
            [name]:value,
        })
    }

    async function onFormSubmit(e){
        e.preventDefault();

        if(!userData.fullName || !userData.avatar_secure_url){
            toast.error("All fields are mandatory!");
            return;
        }
        if(userData.fullName.length<5){
            toast.error("Name must be of minimum 5 characters!");
            return;
        }

        const formData = new FormData();
        formData.append('fullName',userData.fullName);
        formData.append('avatar',userData.avatar_secure_url);

        console.log('formData',formData);

        // console.log("My form data ",formData);

        await dispatch(updateProfile([userData.userId,formData]));
        await dispatch(getUserDetails());

        navigate('/user/profile')
    }

    return(
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
                <form onSubmit={onFormSubmit} noValidate
                className="flex flex-col justify-center gap-5 rounded-lg p-4 text-black w-80 min-h-[26rem] shadow-[0_0_10px_black] ">
                        <h1 className=" text-center text-2xl font-semibold">Edit Profile</h1>
                        <label htmlFor="imageUploads" className="w-28 h-28 rounded-full m-auto">
                            {userData.previewImage?(
                                <img src={userData.previewImage} 
                                className="w-28 h-28 rounded-full m-auto"/>
                            ):(
                                <BsPersonCircle className = 'w-28 h-28 rounded-full m-auto'/>
                            )}
                        </label>
                        <input type="file" 
                               name="imageUploads" 
                               id="imageUploads"
                               className="hidden"
                               accept=".jpg,.png,.svg,.jpeg"
                               onChange={handleImageUpload} />
                        
                        <div className="flex flex-col gap-1">
                            <label htmlFor="fullName" className="text-lg font-semibold">Full Name</label>
                            <input type="text"
                                   name="fullName" 
                                   id="fullName"
                                   value={userData.fullName}
                                   onChange={handleInputChange}
                                   className=" bg-transparent px-2 py-1 border border-green-600 outline-none"
                                   placeholder="Enter your name" />

                            <button type='submit'
                                    className=" bg-green-600 transition-all ease-in-out duration-300 hover:bg-green-500 w-full rounded-sm p-2 text-lg">Update Profile
                            </button>

                            <Link to={'/user/profile'}>
                                <p className=" link text-accent cursor-pointer flex justify-center items-center w-full gap-2">
                                    <AiOutlineArrowLeft />
                                    Go back to profile
                                </p>
                            </Link>
                        </div>
                </form> 
            </div>
        </HomeLayout>
    )
}

export default EditProfile;