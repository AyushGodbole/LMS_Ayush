const errorMiddleWare = (err,req,res,next)=>{

    // if status code not given
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "something went wrong!";

    return res.status(err.statusCode).json({
        success:false,
        message:err.message,
        stack:err.stack
    })
}

export default errorMiddleWare;