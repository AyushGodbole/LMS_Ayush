import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

// note but data get lost when reloaded as JSON.parse is not working , will fix later


// controller for getAllcourses
const getAllCourses = async (req,res,next)=>{
    try {
        const courses = await Course.find();

        // console.log('fetched',courses);

        res.status(200).json({
            success:true,
            message:"All courses",
            courses
    });
    } catch (error) {
        return next(new AppError('failed to fetch course',500));
    }
}

// controller for getAllLectures
const getLecturesByCourseId = async (req, res, next) => {
    try {
      const { courseId } = req.params;
      console.log('abc',courseId);
  
      // Assuming you have a Mongoose model named Course
      const course = await Course.findById(courseId);
  
      console.log('cdetails', course);
  
      // Check if the course exists
      if (!course) {
        return res.status(404).json({
          success: false,
          message: 'Course not found',
        });
      }
  
      // Check if lectures exist
      if (course.lectures.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No lectures found for the provided course',
        });
      }

      // If course is found, return lectures
      res.status(200).json({
        success: true,
        message: 'Lectures by provided id:',
        lectures: course.lectures,
      });
    } catch (error) {
      // Handle errors appropriately, log or send a generic error message
      console.error('Error fetching lectures:', error);
      return next(new AppError('Failed to fetch lectures', 500));
    }
  };
  


// Admin work

// controller for creating course
const createCourse = async(req,res,next)=>{
    // we get form data in req.body
    const {title,description,category,createdBy} = req.body;
    const thumbNail = req.file;

    if(!title || !description || !category || !createdBy){
        return next(new AppError('All fields are required',400));
    }

    if(!thumbNail){
        return next(new AppError('Thumbnail required!',400));
    }

    // // uploading thumbnail
    // if(req.file){
    //     const result = await cloudinary.v2.uploader.upload(req.file.path,{
    //         folder:'lms'
    //     });

    //     if(result){
    //         course.thumbNail.public_id = result.public_id;
    //         course.thumbNail.secure_url = result.secure_url;
    //     }

    //     // deleting from server
    //     // fs.rm(`uploads/${req.file.filename}`);
    // }
    
        // Handle file upload to Cloudinary
        const result = await cloudinary.v2.uploader.upload(thumbNail.path, {
            folder: 'course_thumbnails', // Cloudinary folder for organizing images
        });
  
        const thumbNailPublicId = result.public_id;
        const thumbNailSecureUrl = result.secure_url;

        console.log('done');
        // creating in db
        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbNail:{
                public_id:thumbNailPublicId,
                secure_url:thumbNailSecureUrl
            }
        });

    console.log('deta',course);

    if(!course){
        return next(new AppError('course could not be created!',400));
    }

    await course.save();

    res.status(200).json({
        success:true,
        message:"course created successfully",
        course
    })
}

// controller for updating course via id
const updateCourse = async(req,res,next)=>{
    try {
        // name of variable should be same with what we have writen in put
        // i.e '/:courseId' is name there so here also it should be courseId
        const {courseId} = req.params;

        // put provides some update inbuilt feature
        // finding in db
        const courseDetails = await Course.findByIdAndUpdate(
            courseId,

            // what thing given by user update those only
            {
                $set: req.body,
            },
            {
                runValidators:true,
            }
        );
        // console.log('hello');

        if(!courseDetails){
            return next(new AppError('Failed to update course details!',400));
        }

        res.status(200).json({
            success:true,
            message:"course details updated successfully",
            courseDetails
        });


    } catch (error) {
        return next(new AppError(error.message),400);
    }
}

// contoller for deleting course via id
const removeCourse = async(req,res,next)=>{
    try {
        const {courseId} = req.params;

        const course = await Course.findById(courseId);

        if(!course){
            return next(new AppError("course does not exists!",400));
        }

        await Course.findByIdAndDelete(courseId);

        res.status(200).json({
            success:true,
            message:"course deleted successfully",
        });

    } catch (e) {
        return next(new AppError(e.message,400));
    }
}


// contoller for adding lectures
const addLecture = async(req,res,next)=>{
    try {
        const {title,description} = req.body;

        const {courseId} = req.params;

        const lectureData = {
            public_id:null,
            secure_url:null
        };

        if(!title || !description){
            return next(new AppError("All fields are required!",400));
        }

        const course = await Course.findById(courseId);

        console.log(course);

        if(!course){
            return next(new AppError("course does not exists!",400));
        }

        // const lectureData = {
        //     title,
        //     description,
        //     lecture:{
        //         public_id:null,
        //         secure_url:null
        //     }
        // }

        // console.log('refile',req.file);
        if(req.file){
        try {
                const result = await cloudinary.v2.uploader.upload(req.file.path,{
                    folder:'lms',
                    resource_type:'video',
                    chunk_size:50000000 // 50mb
                })

                if(result){
                    lectureData.public_id = result.public_id;
                    lectureData.secure_url = result.secure_url;
                }

                // console.log('lecData',lectureData)
        
                // deleting from server
                fs.rm(`uploads/${req.file.filename}`);
        } catch (e) {
            return next(new AppError(e.message,400));
        }
    }

        // now pushing data in lectures
        course.lectures.push({
            title,
            description,
            lecture: lectureData
        });
        course.numberOfLectures = course.lectures.length;

        await course.save();

        // console.log('cgot',course);
        res.status(200).json({
            success:true,
            message:"Lecture added successfully",
            course
        });

        // saving in db
    } catch (e) {
        return next(new AppError(e.message,400));
    }
}

// controller for deleting lecture
// but wrong logic
const deleteLecture = async (req, res, next) => {
    const { courseId, lectureId } = req.body;
  
    // console.log('cid lid',courseId,lectureId);

    if (!courseId) {
      return next(new AppError('Course ID is required', 400));
    }
  
    if (!lectureId) {
      return next(new AppError('Lecture ID is required', 400));
    }
  
    try {
      const course = await Course.findById(courseId);
  
      if (!course) {
        return next(new AppError('Invalid ID or Course does not exist', 400));
      }
  
      // Find the index of the lecture in the course's 'lectures' array
      const lectureIndex = course.lectures.findIndex((lecture) => lecture._id == lectureId);
  
      if (lectureIndex === -1) {
        return next(new AppError('Lecture not found in the course', 400));
      }
  
      // Remove the lecture from the 'lectures' array
      course.lectures.splice(lectureIndex, 1);
  
      // Save the course to persist the changes
      await course.save();
  
      res.status(201).json({
        success: true,
        message: 'Lecture removed successfully',
        course,
      });
    } catch (error) {
      return next(new AppError('Error deleting lecture', 500));
    }
  };
  

export{
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLecture,
    deleteLecture
}