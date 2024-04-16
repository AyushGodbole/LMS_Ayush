import {Schema,model} from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from "crypto";

// defining user schema
const userSchema = new Schema({
    fullName:{
        type:String,
        required:[true,"Name is required"],
        minLength:[5,"Name must be of 5 Characters"],
        maxLength:[50,"Name must be of 50 Characters at max"],
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        lowercase:true,
        trim:true,
        unique:[true,"email already taken"],

        // regex validation
        match:[/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm,"Please enter an valid email"]
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:[8,"Password must be atleast 8 characters"],
        // if someone aks for deatils of user don't show password
        select:false
    },

    // profile photo
    avatar:{
        public_id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },

    // who is accessing
    role:{
        type:String,
        enum:['USER','ADMIN'],
        // if not provided who wants to access then treat him as USER
        default:'USER'
    },
    subscription:{
        id:{
            type:String,
        },
        status:{
            type:String,
            default:'inactive'
        },
    },
    forgotPasswordToken:{
        type:String
    },
    forgotPasswordExpiry:{
        type:Date
    },
},{
    timestamps:true
});

// before saving anything we will encrypt password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  });
  

// generating web token
userSchema.methods = {
    generateJWTToken: async function(){
        return jwt.sign(
            {id:this._id,email:this.email,subscription:this.subscription,role:this.role},
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRY
            }
        )
    },

    // comparing password on login
    comparePassword:async function(plainTextPassword){
        return await bcrypt.compare(plainTextPassword,this.password);
    },

    generatePasswordResetToken:async function(){
        // reset token url
        const resetToken = crypto.randomBytes(20).toString('hex');

        // updating in db
        this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.forgotPasswordExpiry = Date.now() + 15*60*1000;  // from now url is valid for 15 minutes.

        return resetToken;
    }
}


// defining collection name
const User = model('LMSUser',userSchema);

export default User;