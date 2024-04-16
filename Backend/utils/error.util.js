class AppError extends Error{
    constructor(message,statusCode){
        super(message);

        this.statusCode = statusCode;

        // for tracing error
        Error.captureStackTrace(this,this.constructor);
    }
}

export default AppError;