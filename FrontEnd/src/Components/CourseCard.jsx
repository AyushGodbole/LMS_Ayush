import {useNavigate} from 'react-router-dom'
function CourseCard({data}){
    const navigate = useNavigate();

    return(
        <div 
            onClick={()=>navigate('/course/description/',{state:{...data}})} className="text-white w-[26rem] h-[485px] shadow-lg rounded-lg cursor-pointer group overflow-hidden">
            <div className="overflow-hidden">
                <img
                 className="h-[18rem] w-full rounded-tl-lg rounded-tr-lg group-hover-scale=[1,2] transition-all ease-in-out" 
                 src={data?.thumbNail.secure_url} 

                //  for sql
                //  src={data?.thumbNail.secure_url} 
                
                 alt="course-thumbnail" />

                 <div className="p-3 space-y-1 text-black">
                    <h2 className="text-xl font-bold text-green-500 line-clamp-2">
                        {data?.course_title}
                    </h2>
                    <p className="line-clamp-2 "> 
                        {data?.course_description}
                    </p>
                    <p className="font-semibold">
                        <span className="text-green-500 font-semibold">Category :</span>
                        {" "}
                        {data?.category}
                    </p>
                    <p className="font-semibold">
                        <span className="text-green-500 font-semibold">Total Lectures :</span>
                        {" "}
                        {data?.numberOfLectures}
                    </p>
                    <p className="font-semibold">
                        <span className="text-green-500 font-semibold">Instructor :</span>
                        {" "}
                        {data?.createdBy}
                    </p>
                 </div>
            </div>
        </div>
    )
}

export default CourseCard;