import { useEffect, useState } from "react"
import HomeLayout from "../Layouts/HomeLayout"
import toast from 'react-hot-toast'
import { isEmailValid } from "../Helper/regex";
import axiosInstance from "../Helper/axiosInstance";
import { useDispatch } from "react-redux";
import { contact } from "../Redux/Slices/Authslice";
import { useNavigate } from "react-router-dom";

function ContactUs(){

    const dispatch = useDispatch()
    const navigate = useNavigate()

   
    const [userInput,setUserInput] = useState({
        name:'',
        email:'',
        message:''
    });

    function handleUserInputChange(e){
        const {name,value} = e.target;
        console.log(name,value);
        setUserInput({
            ...userInput,
            [name]:value
        })
    }

   async function onFormSubmit(e){
        e.preventDefault();
        if(!userInput.email||!userInput.name||!userInput.message){
            toast.error('All fields are mandatory!');
            return;
        }

        // email validations
        if(!isEmailValid(userInput.email)){
            toast.error('invalid email!');
            return;
        }

        const res = await dispatch(contact(userInput));

        if(res.payload.success){
            setUserInput({
                name:'',
                email:'',
                message:'',
            })
        }
        navigate('/');
    }

    return (
        <HomeLayout>
            <div className="flex items-center justify-center h-[100vh]">
            <form noValidate onSubmit={onFormSubmit} className="flex flex-col items-center justify-center gap-2 p-5 rounded-md text-black shadow-[0_0_10px_black] w-[32vw]">
                <h1 className="text-3xl font-semibold">Contact Form</h1>

                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="name" className="text-xl font-semibold">
                        Name
                    </label>
                    <input 
                     type="text" 
                     name="name" 
                     id="name"
                     placeholder="Enter your name"
                     className="bg-transparent border border-green-600 px-2 py-1 rounded-sm outline-none"
                     onChange={handleUserInputChange} />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="email" className="text-xl font-semibold">
                        Email
                    </label>
                    <input 
                     type="email" 
                     name="email" 
                     id="email"
                     placeholder="Enter your email"
                     className="bg-transparent border border-green-600 px-2 py-1 rounded-sm outline-none"
                     onChange={handleUserInputChange} />
                </div>
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="message" className="text-xl font-semibold">
                        Name
                    </label>
                    <textarea 
                     name="message" 
                     id="message"
                     placeholder="Enter your message"
                     className="bg-transparent border border-green-600 px-2 py-1 rounded-sm outline-none resize-none h-40"
                     onChange={handleUserInputChange} />
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-500 transition-all ease-in-out duration-300 rounded-sm py-2 font-semibold text-lg cursor-pointer">
                    Submit
                </button>
            </form>
        </div>
        </HomeLayout>
    )
}

export default ContactUs