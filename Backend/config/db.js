import mongoose from "mongoose";
import { config } from "dotenv";
config();

// if user gives extra information , ignore it
// mongoose.set('strictQuery',false);

const connectToDb = async()=>{
    try {
        const {connection} = await mongoose.connect(
            process.env.MONGOURL
        );
    
        // consoling
        if(connection){
            console.log(`Connected to mongo db as host ${connection.host}`)
        }
    } catch (error) {
       console.log(`Error in connecting to DB`);
       process.exit(1); 
    }
}

export default connectToDb;