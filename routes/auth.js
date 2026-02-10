const express=require('express');
const router=express.Router();
const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

router.post('/register',async (req,res)=>{
    try{
        const { name,email,password,role,specialization,price,mobile }=req.body;
        const existingUser= await prisma.user.findUnique({
        where:{email}
    });
    if(existingUser){
        return res.status(400).json("User already exists");
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
                price
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
    res.status(201).json({message:"User registered successfully",userId:result.id});
    
    
    }
    catch(error){
        console.error("Registration error: ",error);
       res.status(500).json({error:"Failed to create User"});
    }
})

router.post('/login',async (req,res)=>{
    try{
        const{ email,password }=req.body;
        const user=await prisma.user.findUnique({
            where:{email},
            include:{
                docProfile:true,
                patientProfile:true
            }
        });
        if(!user){
            return res.status(400).json({error:"Invalid user or email"});
        }
        const isPassValid=await bcrypt.compare(password,user.password);
        if(!isPassValid){
            return res.status(400).json({error:"Invalid user or email"});
        }
        const token=jwt.sign(
            {userId:user.id , role:user.role},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"1h"}
        );
        const profileId= user.role==='DOCTOR'?
        user.docProfile?.id 
        : user.patientProfile?.id;

        res.json({token,role:user.role,profileId});
    }
    catch(error){
       res.status(500).json({error:"Login Failed"});
    }
});

module.exports=router;
