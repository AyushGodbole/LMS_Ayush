


import { useState } from "react";
import HomeLayout from "../Layouts/HomeLayout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-hot-toast';
import { login } from "../Redux/Slices/Authslice";

function JoinRoom(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {role} = useSelector((state=>state?.auth))

    function handleSubmit(e){
        e.preventDefault()
    }

    return(
        <>
            <HomeLayout>
                <div className="flex justify-center items-center h-[90vh]">
                    <form noValidate onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-3 rounded-lg p-6 text-black shadow-[0_0_10px_black] w-[28%]">
                        <h1 className="text-2xl text-center font-bold pb-8 text-blue-500">Join Room</h1>

                        <div className="flex flex-col gap-2 w-full">
                            <input type="text"
                                   required
                                   name="name" 
                                   id="name" 
                                   placeholder="Enter your name" 
                                   className="bg-transparent border border-blue-400 px-2 py-1 outline-none w-full"
                            />
                        </div>

                        <div className="flex items-center w-full bg-gray-400">
                            <input type="text"
                                   required
                                   name="code" 
                                   id="code" 
                                   placeholder="Enter room code" 
                                   className="bg-transparent border-none px-2  py-1 text-blue-500 outline-none w-[75%] placeholder:text-blue-800 tracking-wider"
                            />
                        </div>

                        <button type="submit" className="m-2 bg-blue-600 hover:bg-blue-500 px-3 py-2 w-full font-semibold rounded text-lg">
                            Join Room
                        </button>

                        {
                            role=='ADMIN' && (
                                <p>
                                    Create a new room ? <Link to='/createRoom' className="link text-accent">Create Room</Link>
                                </p>
                            )
                        }
                    </form>
                </div>
            </HomeLayout>


        </>
    )
}

export default JoinRoom;