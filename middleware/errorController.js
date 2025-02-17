const AppError = require('../utils/appError')

const sendErrorDev = (err,res) =>{
     res.status(err.statusCode).json({
        status:err.status,
        error: err,
        message: err.message,
        stack: err.stack
}) 

}


const globalErrors = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

   if(process.env.NODE_ENV !== 'production'){
         sendErrorDev(err,res);
   }
}

module.exports = globalErrors;