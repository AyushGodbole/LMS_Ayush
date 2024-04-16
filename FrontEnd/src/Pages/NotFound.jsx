import { useNavigate } from "react-router-dom";

function NotFound(){
    const navigate = useNavigate();
    return(
        <div className="flex flex-col items-center justify-center bg-[#1A2238] w-[100vw] h-screen">
            <h1 className="text-9xl font-extrabold text-white tracking-widest">
                404
            </h1>
            <div className="absolute bg-black text-white rotate-12 px-2">
                Page not found...
            </div>
            <button className="mt-5">
                <a className="relative inline-block text-sm font-medium text-[#FF6A3D] active:text-yellow-500">
                    {/* -1 means go back to initial page */}
                    <span onClick={()=>navigate(-1)} className="relative block border border-current bg-[#1A2238] px-8 py-3">Go Back</span>
                </a>
            </button>
        </div>
    )
}

export default NotFound;