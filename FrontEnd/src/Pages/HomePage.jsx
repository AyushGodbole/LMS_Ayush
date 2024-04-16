import { Link } from "react-router-dom";
import HomeLayout from "../Layouts/HomeLayout";
// home page image
import HomepageImage from '../Assets/Images/student.png'
import SearchField from "../Courses/SearchField";

function HomePage(){
    
    return(
        <HomeLayout>

            {/* bg white , width full */}
            <div className="pt=10 text-black flex items-center justify-center gap-10 mx-16 min-h-[90vh] w-screen">
                {/* online courses content */}
                <SearchField/>
                <div className="w-1/2 space-y-6">
                    <h1 className="text-5xl font-semibold flex gap-3">
                        Find out best
                        <span className="text-green-500 font-bold">
                            Online Courses
                        </span>
                    </h1>

                    {/* text blue 800 */}
                    <p className="text-xl text-[#00005b]">
                        We have a large library of courses taught by highly skilled and qualified faculties at a very affordable cost
                    </p>

                    <div className="space-x-6">
                        <Link to='/courses'>
                            {/* bg #19e719 */}
                            <button className=" bg-green-500 px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-[#19e719] transition-all ease-in-out duration-300">
                                Explore courses
                            </button>
                        </Link>

                        <Link to='/contact'>
                            <button className="border border-[#19e719] px-5 py-3 rounded-md font-semibold text-lg cursor-pointer hover:bg-green-500 transition-all ease-in-out duration-300">
                                Contact us
                            </button>
                        </Link>
                    </div>
                </div>


                {/* image content */}
                <div className="w-1/2 flex items-center justify-center mt-9">
                    <img src={HomepageImage} alt="homepage" className=" w-[65%]"/>
                </div>
            </div>

        </HomeLayout>

    )
}

export default HomePage;