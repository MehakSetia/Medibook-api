const { sendAppointEmail } = require('../services/email');
const express=require('express');
const router=express.Router();
const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient();
const authenticationToken=require('../middleware/auth');

router.post('/',authenticationToken,async (req,res)=>{
   try{
    const { doctorId,patientId,date }=req.body;
    const foundSlot=await prisma.doctorSlot.findFirst({
        where:{
            doctorId:parseInt(doctorId),
            dateTime:new Date(date)
        }
    });
    if(foundSlot==null){
        return res.status(404).json("Doc not availabe");
    }
    if(foundSlot.isBooked==true){
        return res.status(400).json("Slot already booked");
    }
    const result=await prisma.$transaction(async (tx)=>{
        const newAppoint=await tx.appointment.create({
            data:{
                doctorId:parseInt(doctorId),
                patientId:parseInt(patientId),
                date:new Date(date),
                status:"CONFIRMED"
            },
            include:{
                doctor:true,
                patient:true
            }
        });
    await tx.doctorSlot.update({
        where:{
            id:foundSlot.id
        },
        data:{
            isBooked:true
        }
    });
    return newAppoint;
});
 const name=result.doctor.name;
 const mail=result.patient.email;
 sendAppointEmail(mail,name,result.date.toDateString());
res.status(201).json({
    id:result.id,
    date:result.date,
    status:result.status,
    doctor:{
        name:result.doctor.name,
        specialization:result.doctor.specialization
    },
    patient:result.patient.email
});
   }
   catch(error){

   }
});



router.patch('/:id/status',authenticationToken,async(req,res)=>{
    try{
    const {id}=req.params;
    const {status}=req.body;

    const foundAppoint=await prisma.appointment.update({
        where:{
            id:parseInt(id)
        },
        data:{
            status:status
        }
    });
    if(status==="CANCELLED"){
        const doctorId=foundAppoint.doctorId;
        const date=foundAppoint.date;
        
        const slotToFree= await prisma.doctorSlot.findFirst({
            where:{
                doctorId,
                dateTime:date
            }
        });
        if(slotToFree){
            await prisma.doctorSlot.update({
                where:{
                    id:slotToFree.id
                },
                data:{
                    isBooked:false
                }
            })
        }
        res.json(foundAppoint);
    }
}

    catch(error){
        console.error(error);
        res.status(500).json({error:"Update failed"});
    }
    
});

router.get('/',authenticationToken,async(req,res)=>{
    try{
        const {userId,role}=req.user;
        let comingAppoint=[];
        if(role==="PATIENT"){
            const foundId= await prisma.patient.findUnique({
                where:{
                    userId:parseInt(userId)
                }
            });
            comingAppoint=await prisma.appointment.findMany({
            where:{
                patientId:foundId.id,
                status:"CONFIRMED"
            },
            select:{
                id:true,
                status:true,
                doctor:{
                    select:{
                        name:true
                    }
                }
            },
            orderBy:{date:'asc'}
        });
        }
        else if(role==="DOCTOR"){
            const foundId=await prisma.doctor.findUnique({
                where:{
                    userId:parseInt(userId),
                }
            });
            comingAppoint=await prisma.appointment.findMany({
                where:{
                    doctorId:foundId.id,
                    status:"CONFIRMED"
                },
                select:{
                    id:true,
                    status:true,
                    patient:{
                        select:{
                            name:true
                        }
                    }
                },
                orderBy:{date:'asc'}
            });
        }
        res.json(comingAppoint);
    }
    catch(error){
        console.error("Get Error ",error);
        res.status(500).json({error:"Could not find appointments"});
    }
});

module.exports=router;
