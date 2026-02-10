const express=require('express');
const router=express.Router();
const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const authenticationToken=require('../middleware/auth');

router.post('/create',authenticationToken,async(req,res)=>{
    try{
        const {date,startTime,endTime}=req.body;
        const userId=req.user.userId;

        const user=await prisma.doctor.findUnique({
            where:{
                userId
                // column of database : var from above
            }
        })
        if(!user){
            return res.status(403).json("No doc found");
        }
        const startHour=parseInt(startTime.toString().split(':')[0]);
        const endHour=parseInt(endTime.toString().split(':')[0]);
        const slots=[];
        for (let i = startHour; i < endHour; i++) {
            const formattedHour=i.toString().padStart(2,'0');
            const iso=`${date}T${formattedHour}:00:00Z`;
            const finalDate=new Date(iso);

            if(isNaN(finalDate)){
                console.error(`Failed to create date for hour: ${i}`);
                continue;
            }

            slots.push({
                dateTime:finalDate,
                doctorId:user.id,
                isBooked:false
            });
        }
        await prisma.doctorSlot.createMany({
            data:slots,
            skipDuplicates:true
        });
        res.status(201).json({
            message:"Schedule created successfully",
            slotsCreated:slots.length
        });
    }
    catch(error){
        console.error("Schedule error: ",error);
        res.status(500).json({error:"Failed to create schedule"});
    }
});
module.exports=router;