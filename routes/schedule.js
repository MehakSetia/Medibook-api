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

router.get('/:doctorId',authenticationToken,async(req,res)=>{
    try{
        const doctorId=req.params.doctorId;
        const {date}=req.query;
        const currDate=new Date();
        
        const foundDoc=await prisma.doctor.findUnique({
            where:{
                id:parseInt(doctorId)
            }
        });
        if(!foundDoc){
            return res.status(403).json("Doc not found");
        }
        let foundSlots=[];
        if(foundDoc.userId!==req.user.userId){
        foundSlots=await prisma.doctorSlot.findMany({
            where:{
                isBooked:false,
                dateTime:{
                    gt:currDate
                },
                doctorId:parseInt(doctorId)
            },
            orderBy:{
                dateTime:'asc'
            }
        });
    }
    else{
        foundSlots=await prisma.doctorSlot.findMany({
            where:{
                dateTime:{
                    gt:currDate
                },
                doctorId:parseInt(doctorId)
            },
            orderBy:{
                dateTime:'asc'
            }
        });
    }

    res.status(201).json(foundSlots);

    }
    catch(error){
        console.error("GET Error: ",error);
        res.status(500).json("Could not get slots");
    }
});

router.delete('/remove/:slotId',authenticationToken,async(req,res)=>{
    try{
        const {slotId}=req.params;
        const foundDoc=await prisma.doctor.findUnique({
            where:{
                userId:req.user.userId
            }
        });
        if(!foundDoc){
            return res.status(403).json("Doc not found");
        }
        const foundSlot=await prisma.doctorSlot.findUnique({
            where:{
                id:parseInt(slotId)
            }
        })
        if(!foundSlot){
            return res.status(403).json("Slot not found");
        }
        if(foundDoc.id!==foundSlot.doctorId){
            return res.status(403).json("You can not delete someone else's slot");
        }
        else if(foundSlot.isBooked===true){
            return res.status(400).json("Cannot delete a booked slot. Please cancel appointment first.");
        }
        await prisma.doctorSlot.delete({
            where:{
                id:parseInt(slotId)
            }
        });
        res.status(200).json("Slot deleted");
    }
    catch(error){
        console.error("Delete Error: ",error);
        res.status(500).json("Could not delete");
    }
});

module.exports=router;