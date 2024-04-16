import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {toast} from 'react-hot-toast';
import { login } from "../Redux/Slices/Authslice";

function Login(){

    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [loginData,setLoginData] = useState({
        email:'',
        password:'',
    });

    function handleUserInput(e){
        const {name,value} = e.target;
        // console.log(name);
        setLoginData({
            ...loginData,
            [name]:value
        }
        )
    }

    async function onLogin(event){
        event.preventDefault();

        if(!loginData.email||!loginData.password){
            toast.error('please fill all details');
            return
        }

        // dispatch create account action
        const response = await dispatch(login(loginData));
        if(response?.payload?.success){
            console.log(response);
            // then go to home page and reset value
            navigate('/');
        }

        setLoginData({
            email:'',
            password:'',
        });
    }
    return(
        <>
            <HomeLayout>
                <div className="flex justify-center items-center h-[90vh]">
                    <form noValidate onSubmit={onLogin} className="flex flex-col justify-center items-center gap-3 rounded-lg p-6 text-black shadow-[0_0_10px_black] w-[28%]">
                        <h1 className="text-2xl text-center font-bold">Login Page</h1>

                        <div className="flex flex-col gap-2 w-full">
                            <label htmlFor="email">Email</label>
                            <input type="email"
                                   required
                                   name="email" 
                                   id="email" 
                                   placeholder="Enter your email..." 
                                   className="bg-transparent border border-green-600 px-2 py-1 outline-none w-full"
                                   onChange={handleUserInput}
                                   value={loginData.email}/>
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
                                   value={loginData.password}/>
                        </div>

                        <button type="submit" className="m-2 bg-green-600 hover:bg-green-500 px-3 py-2 w-full font-semibold rounded text-lg">
                            Login
                        </button>

                        <p>
                            Don't have account ? <Link to='/signup' className="link text-accent">Signup</Link>
                        </p>
                    </form>
                </div>
            </HomeLayout>


        </>
    )
}

export default Login;