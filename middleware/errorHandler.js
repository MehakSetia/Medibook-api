const {ZodError}=require('zod');

const errorHandler=(err,req,res,next)=>{
    if(err instanceof ZodError){
        return res.status(400).json({
            error:"Validation failed",
            details:err.errors.map(e=>({field:e.path.join('.'),message:e.message}))
        });
    }
    const statusCode=err.statusCode || 500;
    res.status(statusCode).json({
        success:false,
        message:err.message || "Internal server error"
    })
};

module.exports=errorHandler;