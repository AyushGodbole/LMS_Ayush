import { useDispatch, useSelector } from 'react-redux';
import { getAllCourses } from '../Redux/Slices/CourseSlice';
import { useEffect } from 'react';
import HomeLayout from '../Layouts/HomeLayout';
import CourseCard from '../Components/CourseCard';


function CourseList(){
    const dispatch = useDispatch();

    // destructuring is done
    const {courseData} = useSelector((state)=>state?.course);
    console.log('haha',courseData)

    async function loadCourses(){
        await dispatch(getAllCourses());
    }

    useEffect(()=>{
        loadCourses();
    },[]);

    return(
        <HomeLayout>
            <div className='min-h-[90vh] pt-12 pl-20 flex flex-col gap-10 text-black  w-full'>
                <h1 className='text-center text-3xl font-semibold mb-5 flex gap-2 justify-center'>
                    Explore the courses made by
                    <span className='font-bold text-green-500'>
                        Industry Experts
                    </span>
                </h1>
                    <div className='mb-10 flex flex-wrap gap-14'>
                        {console.log('data is',courseData)}
                        {courseData?.map((element)=>{
                            console.log('ue',element)
                            return <CourseCard key={element._id} data={element} />
                        })}
                    </div>
            </div>
        </HomeLayout>
    )
}

export default CourseList;