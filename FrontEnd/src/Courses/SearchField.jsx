import { useState } from "react";
import {FaSearch} from 'react-icons/fa'
import axiosInstance from "../Helper/axiosInstance";
import { getAllCourses, getSearchValue } from "../Redux/Slices/CourseSlice";
import { useDispatch } from "react-redux";
import CourseCard from "../Components/CourseCard";
import { useNavigate } from "react-router-dom";

function SearchField(){

    const [searchvalue,setSearchValue] = useState('');
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function handleSearchValueChange(e){
        e.preventDefault();
        const {name,value} = e.target;
        setSearchValue(value);
        // console.log(value)
    }

    async function handleClick(){

        if(searchvalue==''){
            return;
        }
        const response = await dispatch(getSearchValue())
        console.log(response.payload)

        const allCourses = response.payload;
        // allCourses.map((course)=>{
        //     return <CourseCard key={course.course_id} data={course}/>
        // })
        navigate('/searchPage',{state:{allCourses,searchvalue}})

    }

    return(
        <div className=" absolute top-5 right-3 flex gap-2 items-center">
            <FaSearch 
             className=" text-green-500 absolute left-4"
            />
            <input type="text" name="search" id="search" placeholder="search courses..." value={searchvalue} onChange={handleSearchValueChange} className=" px-10 py-2 bg-zinc-300 placeholder:text-green-700 tracking-widest text-md text-green-700 outline-none border-none rounded-md"/>
            <button className=" bg-green-600 px-6 py-2 text-white rounded-md hover:bg-green-500" onClick={handleClick}>search</button>
        </div>
    )
}

export default SearchField