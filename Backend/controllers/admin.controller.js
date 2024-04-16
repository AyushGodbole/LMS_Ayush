import { razorpay } from "../server.js";
import AppError from "../utils/error.util.js";

const getUserStats = async (req, res, next) => {
    try {
      const allSubscriptions = await razorpay.subscriptions.all();
  

      const insideElement = allSubscriptions.items;

      const totalSubscriptionsCount = insideElement.length;

      let allSubscriptionsCount = 0;


      insideElement.map((item)=>{
        if(item.status==='active'){
            allSubscriptionsCount++;
        }
      })
    //   console.log('allsubs', allSubscriptions);

  
      res.status(200).json({
        success: true,
        message: "Stats fetched successfully",
        totalSubscriptionsCount,
        allSubscriptionsCount,
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  };
  

export default getUserStats;