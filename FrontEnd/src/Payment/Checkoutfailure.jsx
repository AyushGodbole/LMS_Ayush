import { RxCrossCircled } from "react-icons/rx";
import HomeLayout from "../Layouts/HomeLayout";
import { Link } from "react-router-dom";

function Checkoutfailure(){
    return (
        <HomeLayout>
            <div className=" min-h-[90vh] flex items-center justify-center text-white">
                <div className=" w-80 h-[26rem] flex flex-col justify-center items-center shadow-[0_0_10px_black] rounded-lg relative">
                    <h1 className=" bg-red-500 absolute top-0 w-full py-4 text-2xl font-bold rounded-tl-lg rounded-tr-lg text-center">Payment Failed</h1>

                    <div className="px-4 flex flex-col items-center justify-center space-y-2">
                        <h2 className="text-lg font-semibold">
                            Oops ! your payment failed
                        </h2>
                        <p className=" text-left">
                            Please try again later
                        </p>

                        <RxCrossCircled className=" text-red-500 text-5xl" />
                    </div>

                    <Link to='/checkout' className=" bg-red-500 hover:bg-red-600 transition-all ease-in-out duration-300 absolute bottom-0 w-full py-2 font-semibold text-center rounded-bl-lg rounded-br-lg">
                        <button>Try again</button>
                    </Link>
                </div>
            </div>
        </HomeLayout>
    )
}

export default Checkoutfailure;

