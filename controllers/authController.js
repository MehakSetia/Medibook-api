const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {registerSchema,loginSchema}=require('../validators/authSchema');

const register=async (req,res,next)=>{
    try{
        const { name,email,password,role,specialization,price,mobile,phone }=req.body;

        registerSchema.parse(req.body);

        const existingUser= await prisma.user.findUnique({
        where:{email}
    });
    if(existingUser){
        const error=new Error("User already exists");
        error.statusCode=400;
        return next(error);
    }
    const hashedPass= await bcrypt.hash(password,10);
    const result= await prisma.$transaction(async(tx)=>{
        const user= await tx.user.create({
           data:{
            email,
            password:hashedPass,
            role:role
           }
        });
       if(role==='DOCTOR'){
        await tx.doctor.create({
            data:{
                userId:user.id,
                name:name,
                specialization,
                price,
                phone
            }
        });
      }
    else if(role==="PATIENT"){
        await tx.patient.create({
            data:{
                userId:user.id,
                name,
                email,
                mobile
            }
        });
    }
    return user;
});
    return res.status(201).json({message:"User created",userId:result.id});
    
    
    }
    catch(error){
        next(error);
    }
};

const login=async (req,res,next)=>{
    try{
        const{ email,password }=req.body;

        loginSchema.parse(req.body);

        const user=await prisma.user.findUnique({
            where:{email},
            include:{
                docProfile:true,
                patientProfile:true
            }
        });
        if(!user){
            console.error("[AUTH ERROR]: Login failed - Email not found in database.");
            const error=new Error("Invalid email or password");
            error.statusCode=400;
            return next(error);
        }
        const isPassValid=await bcrypt.compare(password,user.password);
        if(!isPassValid){
            console.error("[AUTH ERROR]: Login failed - Password mismatch for user:", email);
            const error=new Error("Invalid email or password");
            error.statusCode=400;
            return next(error);
        }
        const token=jwt.sign(
            {userId:user.id , role:user.role},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"1h"}
        );
        const profileId= user.role==='DOCTOR'?
        user.docProfile?.id 
        : user.patientProfile?.id;

        return res.json({token,role:user.role,profileId});
    }
    catch(error){
       return next(error);
    }
};

module.exports={register,login};