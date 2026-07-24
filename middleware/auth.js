require('dotenv').config();
const jwt=require('jsonwebtoken');

const authenticationToken=async(req,res,next)=>{
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];

    if(token==null){
        return res.status(401).json({error:"Access token required"});
    }
    
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            console.error("JWT Verification Error: ",err.message);
            return res.status(403).json("Invalid or expired Token");
        }
        req.user=user;
        next();
    })
}

const requireRole=(role)=>{
    return (req,res,next)=>{
        if(req.user.role!==role){
            return res.status(403).json("Access denied");
        }
        next();
    }
}

module.exports={authenticationToken,requireRole};