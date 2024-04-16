import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {getRazorpayId, purchaseCourseBundle, verifyPayment} from '../Redux/Slices/RazorpaySlice'
import { useEffect } from "react";
import toast from "react-hot-toast";
import HomeLayout from '../Layouts/HomeLayout'
import {BiRupee} from 'react-icons/bi'

function Checkout(){
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const razorpaykey = useSelector((state)=>state?.razorpay?.key);
    const subscription_id = useSelector((state)=>state?.razorpay?.subscription_id);
    console.log(razorpaykey,subscription_id);
    const isPaymentVerified = useSelector((state)=>state?.razorpay?.isPaymentVerified);
    const userData = useSelector((state)=>state?.auth?.data);
    const paymentDetails = {
        razorpay_payment_id : '',
        razorpay_subscription_id : '',
        razorpay_signature : ''
    }

    function handleSubscription(e){
        e.preventDefault();

        console.log('recieved key',razorpaykey);
        console.log('recieved sid',subscription_id);
        // console.log(userData);
        if(!razorpaykey || !subscription_id){
            toast.error("something went wrong again!");
            return;
        }

        const options = {
            key:razorpaykey,
            subscription_id: subscription_id,
            name : 'Coursify Pvt.Ltd',
            description : 'Subscription',
            theme:{
                color:'#6cd795'
            },
            prefill:{
                email:userData.email,
                name:userData.fullName
            },
            handler : async function(response){
                paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
                paymentDetails.razorpay_subscription_id = response.razorpay_subscription_id;
                paymentDetails.razorpay_signature = response.razorpay_signature;

                toast.success('Payment Successful');
                console.log('DET',paymentDetails);


                const res = await dispatch(verifyPayment(paymentDetails));
                // console.log('adu',res);
                (res.payload.success) ? navigate('/checkout/success') : navigate('/checkout/fail');
            }
        }
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    async function load(){
        await dispatch(getRazorpayId());
        await dispatch(purchaseCourseBundle());
    }

    useEffect(()=>{
        load();
    },[])

    

    return(
        <HomeLayout>
            <form noValidate onSubmit={handleSubscription}
            className=" min-h-[90vh] flex items-center justify-center text-black">
                <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
                    <h1 className=" bg-green-500
                     absolute top-0 w-full text-center py-4 text-2xl font-bold rounded-tl rounded-tr">Subscription Bundle</h1>
                     <div className="px-4 space-y-5 text-center">
                        <p>
                            This purchase will allow you to access all available course of our platform for {" "}
                            <span className=" text-green-500 font-bold"> 
                                <br />
                                1 Year duration{' '}
                            </span>
                            All the existing and new launched courses will be also available
                        </p>

                        <p className="flex items-center justify-center gap-1 text-2xl font-bold text-green-500">
                            <BiRupee /><span>499</span> only
                        </p>
                        <div>
                            <p>100% refund on cancellation</p>
                            <p>* Terms and condition applied</p>
                        </div>

                        <button type="submit" className=" bg-green-600 hover:bg-green-500 transition-all ease-in-out duration-300 absolute py-3 bottom-0 w-full left-0 font-bold text-lg rounded-bl-lg rounded-br-lg">
                            Buy now
                        </button>
                     </div>
                </div>                
            </form>
        </HomeLayout>
    )
}

export default Checkout;