require('dotenv').config();
const jwt=require('jsonwebtoken');

function authenticationToken(req,res,next){
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(' ')[1];

    if(token==null){
        return res.status(401).json({error:"Access token required"});
    }
    console.log("------------------------------------------------");
    console.log("🔍 Debugging Middleware:");
    console.log("Token Received:", token.substring(0, 15) + "..."); // Print start of token
    console.log("Secret being used:", process.env.ACCESS_TOKEN_SECRET); // Check if this is undefined!
    console.log("------------------------------------------------");
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err){
            console.error("JWT Verification Error: ",err.message);
            return res.status(403).json("Invalid or expired Token");
        }
        req.user=user;
        next();
    })
}
module.exports=authenticationToken;