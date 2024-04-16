import AppError from "../utils/error.util.js";
import User from '../models/userModels.js';
import cloudinary from "cloudinary";
import fs from 'fs/promises';
import sendEMail from "../utils/sendmail.js";
import crypto from "crypto";
import nodemailer from 'nodemailer'
const cookieOptions = {
    maxAge:7*24*60*60*1000, // 7 days
    httpOnly:true,
    secure:true,
    sameSite:'none',
}

const register = async(req,res,next)=>{
    const {fullName , email , password} = req.body;

    if(!fullName || !email || !password){
        // instead of this create a class for such errors
        // return res.status(400).json({})

        return new next(AppError('All fields are required',400));
    }

    try {
        // check if user exists
    const userExists = await User.findOne({email});

    if(userExists){
        return next(new AppError("Email already taken!",400));
    }

    // if user not exists then create the user
    const createUser = await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:null
        }
    });

    if(!createUser){
        return next(new AppError("User Registration Failed!",400));
    }

    // File Upload
    console.log(`File Details : ${JSON.stringify(req.file)}`);
    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                heigth:250,
                gravity:'faces',
                crop:'fill'
            })

            if(result){
                createUser.avatar.public_id = result.public_id;
                createUser.avatar.secure_url = result.secure_url;

                // remove file from server
                fs.rm(`uploads/${req.file.filename}`);
            }

        } catch (e) {
            return next(new AppError(e||'File not uploaded , pls try again later!'),500);
        }
    }


    // when we send data to server from client it is in binary form , so data can be stored in database , but to store images etc we use third party service called cloudinary.
    // multer is used to convert binary image to proper actual image.
    // for that you have to send data in form-data


    // saving in DB
    await createUser.save();


    createUser.password = undefined;

    const token = await createUser.generateJWTToken();

    res.cookie("token",token,cookieOptions);

    res.status(201).json({
        success:true,
        message:"user registered successfully",
        data:createUser
    });
    } catch (error) {
        return next(new AppError(error.message,400));
    }
}

const login = async (req,res,next)=>{
    const {email,password} = req.body;

    if(!email||!password){
        return next(new AppError('All fields are required!',400));
    }

    try {
        const existingUser = await User.findOne({email}).select('+password');

        if(!existingUser || !existingUser.comparePassword(password)){
            return next(new AppError('Email or Password does not match',400));
        }

        existingUser.password = undefined;

        const token = await existingUser.generateJWTToken();
        // console.log("GEnerated token :",token);
        
        res.cookie("token",token,cookieOptions);
        // console.log(cookie);

        res.status(200).json({
            success:true,
            message:'user logged-in successfully',
            data:existingUser
        });
    } catch (error) {
        return next(new AppError(error.message,400));
    }
}

const logout = (req,res)=>{
    // by deleting cookie user will simply logout
    res.cookie("token",null,{
        maxAge:0,
        httpOnly:true,
        secure:true
    });

    res.status(200).json({
        success:true,
        message:'user logged out successfully',
    });
}

const getProfile = async (req,res,next)=>{
    // get details from cookies
    try {
        const userid = req.user.id;

        console.log('uid',userid);
        const loginUser = await User.findById(userid);

        res.status(200).json({
            success:true,
            message:'User details',
            data:loginUser
        });
    } catch (error) {
        return next(new AppError('Failed to fetch user profile!',402));
    }

}


// forgot password controller
const forgotPassword = async (req,res,next)=>{
    const {email} = req.body;

    if(!email){
        return next(new AppError('Email is required',400));
    }

    const user = await User.findOne({email});

    if(!user){
        return next(new AppError('Email not registered',400));
    }

    const resetToken = await user.generatePasswordResetToken();

    // now saving in db
    await user.save();

    // now path for reset password
    const resetPasswordURL = `${process.env.FRONT_END_URL}/resetPassword/${resetToken}`;

    // sending email

    const subject = `Reset Password`;
    const message = `you can reset your password by simply clicking on <a href=${resetPasswordURL} target="_blank"`;
    try {
        await sendEMail(email,subject,message);

        res.status(200).json({
            success:true,
            message:`Reset Password token has been sent to ${email} successfully`
        })
    } catch (e) {
        // if fails then reset all

        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save();
        return next(new AppError(e.message,500));
    }
}

// reset password controller
const resetPassword = async (req,res,next)=>{
    // we get token url in params
    const {resetToken} = req.params;

    const {newPassword} = req.body;

    const forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // finding token in db

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry:{gt:Date.now()}
    });

    if(!user){
        return next(new AppError('token is invalid or expired',400));
    }

    // saving new password
    user.password = newPassword;
    user.forgotPasswordExpiry = undefined;
    user.forgotPasswordToken = undefined;

    await user.save();

    res.status(200).json({
        success:true,
        message:"password set successfully"
    })
}


// controller for update password
const updatePassword = async (req,res)=>{
    const {oldPassword,newPassword} = req.body;


    if(!oldPassword || !newPassword){
        return next(new AppError('All fields are required!',400));
    }

    // getting user id from isLoggenIn
    const {userId} = req.user.id;

    const userByThisId = await User.findOne({userId}).select('+password');

    if(!userByThisId){
        return next(new AppError('user does not exists',400));
    }

    // comparing password
    isPasswordValid = await userByThisId.comparePassword(oldPassword);

    if(!isPasswordValid){
        return next(new AppError('invalid old password!',400));
    }

    // if password is valid then update it
    userByThisId.password = newPassword;

    await userByThisId.save();

    // security
    userByThisId.password = undefined;

    res.status(200).json({
        success:true,
        message:"password changed successfully"
    });
}


// controller for profile update
const updateProfile = async (req,res,next)=>{
    const {fullName} = req.body;
    const {id} = req.params;

    // console.log('fullName Recieved',fullName);
    const user = await User.findById(id);

    if(!user){
        return next(new AppError('user does not exists!',400));
    }

    user.fullName = fullName;

    if(req.file){
        // if new avatar is given then destroy old image url
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);

        // now upload new one
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path,{
                folder:'lms',
                width:250,
                heigth:250,
                gravity:'faces',
                crop:'fill'
            })

            if(result){
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;

                // remove file from server
                fs.rm(`uploads/${req.file.filename}`);
            }

        } catch (e) {
            return next(new AppError(e||'File not uploaded , pls try again later!'),500);
        }
    }

    // console.log('saved user',user)
    await user.save();

    res.status(200).json({
        success:true,
        message:"profile updated successfully",
    });
}

const contact = async function(req,res,next){
    const {name,email,message} = req.body;
    console.log(name,email,message);

// Connect to smtp
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});
  
  // Create an email message
  const mailOptions = {
    from: email,
    to: process.env.SMTP_TO_EMAIL, // Recipient's email address
    subject: 'Received Message from Your Website',
    text: `
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
  };
  
  // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });


    res.status(200).json({
        success:true,
        message:'Thanks for your feedback'
    });
}

export{
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateProfile,
    contact
}