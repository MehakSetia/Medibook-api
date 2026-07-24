const express=require('express');
const router=express.Router();
const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const {authenticationToken,requireRole}=require('../middleware/auth');
const {createScheduleSchema}=require('../validators/scheduleSchema');

const createSchedule=async(req,res,next)=>{
    try{
        const {date,startTime,endTime}=req.body;
        createScheduleSchema.parse(req.body);
        const userId=req.user.userId;

        const user=await prisma.doctor.findUnique({
            where:{
                userId
                // column of database : var from above
            }
        })
        
        const baseDate =date;
        const startHour=parseInt(startTime.toString().split(':')[0]);
        const endHour=parseInt(endTime.toString().split(':')[0]);
        const slots=[];
        for (let i = startHour; i < endHour; i++) {
            const formattedHour=i.toString().padStart(2,'0');
            const iso=`${baseDate}T${formattedHour}:00:00Z`;
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
        return next(error);
    }
};

const getSlots=async(req,res,next)=>{
    try{
        const doctorId=req.params.doctorId;
        const {date}=req.query;
        
        
        const foundDoc=await prisma.doctor.findUnique({
            where:{
                id:parseInt(doctorId)
            }
        });

        if(!foundDoc){
            return res.status(404).json("Doc not found");
        }

        const searchDate=new Date(date);
        const startOfDay=new Date(searchDate);
        startOfDay.setUTCHours(0,0,0,0);

        const endOfDay=new Date(searchDate);
        endOfDay.setUTCHours(23,59,59,999);
        
        let foundSlots=[];
        if(foundDoc.userId!==req.user.userId){
        foundSlots=await prisma.doctorSlot.findMany({
            where:{
                isBooked:false,
                dateTime:{
                    gte:startOfDay,
                    lte:endOfDay
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
                    gte:startOfDay,
                    lte:endOfDay
                },
                doctorId:parseInt(doctorId)
            },
            orderBy:{
                dateTime:'asc'
            }
        });
    }

    return res.status(200).json(foundSlots);

    }
    catch(error){
        return next(error);
    }
};

const deleteSlots=async(req,res,next)=>{
    try{
        const {slotId}=req.params;
        const foundDoc=await prisma.doctor.findUnique({
            where:{
                userId:req.user.userId
            }
        });
        
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
        return res.status(200).json("Slot deleted");
    }
    catch(error){
        return next(error);
    }
};

module.exports={createSchedule,getSlots,deleteSlots};