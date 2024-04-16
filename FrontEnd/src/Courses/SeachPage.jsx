import { useLocation } from "react-router-dom";
import HomeLayout from "../Layouts/HomeLayout";
import CourseCard from "../Components/CourseCard";
import { useState } from "react";

function SearchPage(){

    const data = useLocation().state
    // console.log('all',allcourses)
    const {allCourses,searchvalue} = data
    console.log('daa',allCourses,searchvalue)
    const filteredSearch = allCourses.filter(course=>{
        return Object.keys(course).some(key=>{
            if(key==='course_title' && typeof course[key]==='string'){
                return course[key].includes(searchvalue)
            }
            return false;
        })
    });
    console.log('fil',filteredSearch)
    
    return(

        <HomeLayout>

            {filteredSearch.length==0 && 
            <div className="">
            {
                <h1 className=" text-5xl text-yellow-500 flex justify-center items-center min-h-[90vh]">Result not found!</h1>
            }
            </div>}

            {filteredSearch.length!=0 && 
            <div className=" flex flex-wrap gap-16">
            {
                filteredSearch.map((course)=>{
                    return <CourseCard key={course.course_id} data={course}/>
                })
            }
            </div>}
        </HomeLayout>
    )
}

export default SearchPage