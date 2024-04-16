import User from "../models/userModels.js";
import Payment from "../models/payment.model.js";
import {razorpay} from '../server.js'
import AppError from "../utils/error.util.js";
import crypto from "crypto";

const getRazorpayApiKey = async (req, res, next) => {
  // console.log('razorpayKey is',process.env.RAZORPAY_KEY_ID);
  res.status(201).json({
    success: true,
    message: "Razorpay Api Key sent successfully",
    key: process.env.RAZORPAY_KEY_ID,
  });
};



const buySubscription = async (req, res, next) => {
  try {
    const userid = req.user.id;

    const user = await User.findById(userid);
    console.log('adarsh',userid);
    if (!user) {
      return next(new AppError("Unauthorized user",400));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cant buy",400));
    }

    // buy subscription
    console.log('bablu1');

    
    // console.log("ayuaja");
    console.log('bablu2');
    // console.log(process.env.RAZORPAY_PLAN_ID)
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
      total_count:20,
    });

    console.log('recib',subscription)
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    console.log(user);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Subcription done successfully",
      subscription_id: subscription.id,
    });

  } catch (error) {
    console.error("Error in buySubscription:", error);
    return next(new AppError(error.message, 500));
  }
};

const verifySubscription = async (req, res, next) => {
  try {
    // verifying if payment is done
    const userid  = req.user.id;
    const {
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    } = req.body;

    const user = await User.findById(userid);

    if (!user) {
      return next(new AppError("Unauthorized user",400));
    }

    console.log('recieved user ',user);
    const subscription_id = user.subscription.id;

    console.log('pid',razorpay_payment_id,'sub',subscription_id,'rsub',razorpay_subscription_id)
    // const piping = razorpay_payment_id + '|' + subscription_id;
    // if signature provided matches with our signature then payment is done

    // const generatedSignature = crypto
    //   .createHmac("sha256", process.env.RAZORPAY_SECRET)
    //   .update(`${razorpay_payment_id} | ${subscription_id}`)
    //   .digest("hex");

      const newGeneratedSignature = crypto.createHmac('sha256',process.env.RAZORPAY_SECRET).update(`${razorpay_payment_id}|${subscription_id}`).digest('hex')
      console.log('arun',razorpay_signature,newGeneratedSignature)
    if (newGeneratedSignature !== razorpay_signature) {
      return next(new AppError("payment not verified",400));
    }

    // creating entry in payment database
    await Payment.create({
      razorpay_payment_id,
      razorpay_subscription_id,
      razorpay_signature,
    });

    // activating accout which was previously null
    user.subscription.status = "active";

    await user.save();

    res.status(200).json({
      success: true,
      message: "payment verified successfully",
    });
  } catch (error) {
    return next(new AppError(error.message,500));
  }
};

const cancelSubscription = async (req, res, next) => {
  // to cancel subscription we only need subscription_id
  try {
    const  userid  = req.user.id;

    const user = await User.findById(userid);

    if (!user) {
      return next(new AppError("Unauthorized user",400));
    }

    // admin cannot cancel subscription
    if (user.role == "ADMIN") {
      return next(new AppError("Admin cant buy",400));
    }

    const subscription_id = user.subscription.id;

    const cancelSubscription = await razorpay.subscriptions.cancel(
      subscription_id
    );

    // deactivating status

    user.subscription.status = cancelSubscription.status;

    await user.save();
    res.status(200).json({
      success: true,
      message: "Subscrption cancelled successfully",
    });
  } catch (error) {
    return next(new AppError(error.message,500));
  }
};

const getAllPayments = async (req, res, next) => {
  try {
    const { count } = req.query;

    // console.log('count',count)

    // getting how many counts (details) ADMIN wants
    const allSubscriptions = await razorpay.subscriptions.all({
      count: count || 10,
    });

    console.log(allSubscriptions)
    // const finalMonths = allSubscriptions.map((subscription) => {
    //   const endAt = new Date(subscription.end_at);
    //   const month = endAt.getMonth(); // 0 for January, 1 for February, etc.
    //   return month;
    // });
    
    // console.log(finalMonths);

    


    // console.log('all subscriptions',allSubscriptions.count)
    res.status(201).json({
      success: true,
      message: "All payments fetched successfully",
      allSubscriptions,
    });
  } catch (error) {
    return next(new AppError(error.message,500));
  }
};

export {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  getAllPayments,
};
