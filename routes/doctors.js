const express=require('express');
const router=express.Router();
const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient();
const authenticationToken=require('../middleware/auth')

router.post('/',authenticationToken,async (req,res)=>{
  try{
    const { name,specialization,price }=req.body;
    const newDoc= await prisma.doctor.create({
        data:{ name,specialization,price }
    });
    res.status(201).json(newDoc);
  }
  catch(error){
    res.status(500).json({error:"Failed to create a doctor"});
  }
});

router.get('/',async (req,res)=>{
  try{
    const docs=await prisma.doctor.findMany();
    res.json(docs);
  }
  catch(error){
    res.status(500).json({error:"Failed to fetch docs"});
  }
});

router.get('/:id/slots',async(req,res)=>{
  try{
    const {id}=req.params;
    const {date}=req.query;

    const searchDate=new Date(date);
    const startOfDay=new Date(searchDate);
    startOfDay.setUTCHours(0,0,0,0);

    const endOfDay=new Date(searchDate);
    endOfDay.setUTCHours(23,59,59,999);

    const foundSlot=await prisma.doctorSlot.findMany({
      //  findMany returns empty arr automatically if not found anything so no need of if statement.
      where:{
        doctorId:parseInt(id),
        isBooked:false,
        dateTime:{
          gte:startOfDay,
          lte:endOfDay
        }
      },
      orderBy:{
        dateTime:'asc'
      }
    });
    res.json(foundSlot);
  }
  catch(error){
    console.error(error);
    res.status(500).json({error:"Could not fetch slots"});
  }
});


module.exports=router;