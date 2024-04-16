import User from "../models/userModels.js";
import AppError from "../utils/error.util.js";
import jwt from "jsonwebtoken";

const isLoggedIn = async (req,res,next)=>{
    try {
        // getting token from cookie
    const {token} = req.cookies;
    console.log('token is ',token);

    if(!token){
        return next(new AppError('unauthenticated user, please log in again!',400));
    }

    // extracting user information from token
    const userDetails = await jwt.verify(token,process.env.JWT_SECRET);

    req.user = userDetails;

    next();

    } catch (error) {
        return next(new AppError("something went wrong at getting details",400));
    }
}

const authorizedRoles = (...roles) => (req,res,next)=>{
    const currentUserRole = req.user.role;

    if(!roles.includes(currentUserRole)){
        return next(
            new AppError(`you don't have permissions to access this!`,403)
        )
    }

    next();
}

const authorizedSubscriber = async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    console.log(user);

    if(user.role!="ADMIN" && user.subscription.status!='active'){
        return next(
            new AppError(`please subscribe to access this!`,400)
        );
    }

    next();
}

export  {
    isLoggedIn,
    authorizedRoles,
    authorizedSubscriber
}