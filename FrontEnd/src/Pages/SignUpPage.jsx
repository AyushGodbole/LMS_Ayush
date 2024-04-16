import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { BsPersonCircle } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {toast} from 'react-hot-toast';
import { createUserAccount } from "../Redux/Slices/Authslice";
import { isEmailValid, isPasswordValid } from "../Helper/regex";

function SignUp(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [previewImage,setPreviewImage] = useState("");

    const [signupData,setSignupData] = useState({
        fullName:'',
        email:'',
        password:'',
        avatar:'',
    });

    function handleUserInput(e){
        const {name,value} = e.target;
        // console.log(name);
        setSignupData({
            ...signupData,
            [name]:value
        })
        // console.log(signupData)
    }

    function getImage(event){
        event.preventDefault();

        // getting the image
        const uploaded_image = event.target.files[0];
        if(uploaded_image){
            setSignupData({
                ...signupData,
                avatar:uploaded_image
            });

        console.log('upload',uploaded_image)

            const fileReader = new FileReader()
            fileReader.readAsDataURL(uploaded_image);
            fileReader.addEventListener('load',function (){
                // FileReader provide feature of result , but not works in arrow function
                // console.log('imageUrl : ',this.result);
                setPreviewImage(this.result);
            })
        }
    }

    async function createAccount(event){
        event.preventDefault();

        if(!signupData.email||!signupData.fullName||!signupData.password||!signupData.avatar){
            toast.error('please fill all details');
            return
        }

        // checking name field length
        if(signupData.fullName.length<5){
            toast.error('Name should be atleast of 5 characters');
            return;
        }

        // email validations
        if(!isEmailValid(signupData.email)){
            toast.error('invalid email!');
            return;
        }

        // password validations
        if(!isPasswordValid(signupData.password)){
            toast.error('password should be of atleast 8 character , use of special and alphanumberic values');
            return
        }

        // creating new form data
        const formData = new FormData();
        formData.append('fullName',signupData.fullName);
        formData.append('email',signupData.email);
        formData.append('password',signupData.password);
        formData.append('avatar',signupData.avatar);

        // dispatch create account action
        const response = await dispatch(createUserAccount(formData));
        if(response?.payload?.success){
            console.log(response);
            // then go to home page and reset value
            navigate('/');
        }

        setSignupData({
            fullName:'',
            email:'',
            password:'',
            avatar:'',
        });
        setPreviewImage('');
    }
    return(
        <>
            <HomeLayout>
                <div className="flex justify-center items-center h-[90vh]">
                    <form noValidate onSubmit={createAccount} className="flex flex-col justify-center items-center gap-3 rounded-lg p-6 text-black shadow-[0_0_10px_black] w-[28%]">
                        <h1 className="text-2xl text-center font-bold">Registration Page</h1>

                        <label htmlFor="image_upload">
                            {previewImage?(
                                <img src={previewImage} alt="user_image" className="w-24 h-24 cursor-pointer" />
                            ):(
                                <BsPersonCircle className="w-24 h-24 rounded-full cursor-pointer"/>
                            )
                        }
                        </label>

                        <input type="file" 
                               name="image_upload" 
                               id="image_upload" 
                               accept=".jpg, .jpeg, .png, .svg" 
                               className="hidden"
                               onChange={getImage}/>

                        <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="fullName">Name</label>
                            <input type="text"
                                   required
                                   name="fullName" 
                                   id="fullName" 
                                   placeholder="Enter your Name..." 
                                   className="bg-transparent border border-green-600 px-2 py-1 outline-none w-full"
                                   onChange={handleUserInput}
                                   value={signupData.fullName}/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="email">Email</label>
                            <input type="email"
                                   required
                                   name="email" 
                                   id="email" 
                                   placeholder="Enter your email..." 
                                   className="bg-transparent border border-green-600 px-2 py-1 outline-none w-full"
                                   onChange={handleUserInput}
                                   value={signupData.email}/>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="password">Password</label>
                            <input type="password"
                                   required
                                   name="password" 
                                   id="password" 
                                   placeholder="Enter your password..." 
                                   className="bg-transparent border border-green-600 px-2 py-1 outline-none w-full"
                                   onChange={handleUserInput}
                                   value={signupData.password}/>
                        </div>

                        <button type="submit" className="m-2 bg-green-600 hover:bg-green-500 px-3 py-2 w-full font-semibold rounded text-lg">
                            Create account
                        </button>

                        <p>
                            Already have account ? <Link to='/login' className="link text-accent">Login</Link>
                        </p>
                    </form>
                </div>
            </HomeLayout>


        </>
    )
}

export default SignUp;