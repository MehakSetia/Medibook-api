const express=require('express');
const router=express.Router();
const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient();

router.post('/', async (req,res)=>{
    try{
        const {name,email,mobile }=req.body;
        const newPat= await prisma.patient.create({
          data:{name,email,mobile}
        });
        res.status(201).json(newPat);
    }
    catch(error){
        res.status(500).json({error:"Failed to create a patient"});
    }
})
router.get('/',async (req,res)=>{
    try{
        const patients=await prisma.patient.findMany();
        res.json(patients);
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch patients"});
    }
})

module.exports=router;