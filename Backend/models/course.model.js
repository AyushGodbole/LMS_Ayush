import {model,Schema} from "mongoose";

const courseSchema = new Schema({
    title:{
        type:String,
        required:[true,"Title is required"],
        minLength:[1,"Title should be of minimum 1 characters"],
        maxLength:[100,"Title should be less than 100 characters"],
        trim:true,
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        minLength:[1,"Description should be of minimum 5 characters"],
        maxLength:[1000,"Description should be less than 1000 characters"],
        trim:true,
    },
    category:{
        type:String,
        required:[true,"Category is required"],
    },
    thumbNail:{
        public_id:{
            type:String,
            required:true
        },
        secure_url:{
            type:String,
            required:true
        }
    },
    lectures:[
        {
            title:{
                type:String,
                required:true
            },
            description:{
                type:String,
                required:true
            },
            lecture:{
                public_id:{
                    type:String,
                    required:true
                },
                secure_url:{
                    type:String,
                    required:true
                }
            }
        }
    ],
    numberOfLectures:{
        type:Number,
        default:0
    },
    createdBy:{
        type:String,
        required:true
    }
},
{
    timestamps:true
});


const Course = model('course',courseSchema);

export default Course;