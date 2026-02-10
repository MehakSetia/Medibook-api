const { sendAppointEmail } = require('../services/email');
const express=require('express');
const router=express.Router();
const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient();
const authenticationToken=require('../middleware/auth');

router.post('/',authenticationToken,async (req,res)=>{
   try{
    const { date }=req.body;
    const id=await prisma.patient.findUnique({
        where:{
            userId:parseInt(req.user.userId)
        }
    });
    if(!id){
        return res.status(403).json("Only registered patients can book appointments");
    }
    const patientId=id.id;
    const {doctorId}=req.body;
    const foundSlot=await prisma.doctorSlot.findFirst({
        where:{
            doctorId:parseInt(doctorId),
            dateTime:new Date(date)
        }
    });
    if(!foundSlot){
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
    console.error("Transaction failed: ",error);
    res.status(500).json("Appointment not booked");
   }
});


router.patch('/:id/status',authenticationToken,async(req,res)=>{
    try{
    const {id}=req.params;
    const {status}=req.body;

    if(status==="CANCELLED"){
        return res.status(400).json("Use /cancel routes to cancel appointments");
    }

    const foundAppoint=await prisma.appointment.update({
        where:{
            id:parseInt(id)
        },
        data:{
            status:status
        }
    });
    
    res.json(foundAppoint);
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
            },
            select:{
                id:true,
                status:true,
                date:true,
                doctor:{
                    select:{
                        name:true,
                        specialization:true
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
                },
                select:{
                    id:true,
                    status:true,
                    date:true,
                    patient:{
                        select:{
                            name:true,
                            email:true
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

router.post('/cancel',authenticationToken,async(req,res)=>{
    try{
    const {appointId}=req.body;
    const foundAppoint=await prisma.appointment.findUnique({
        where:{
            id:parseInt(appointId)
        },
        include:{
            patient:true
        }
    });
    if(!foundAppoint){
        return res.status(404).json("Appointment not found");
    }
    if(foundAppoint.patient.userId!==req.user.userId){
        return res.status(403).json("You don't own this appointment");
    }
    else if(foundAppoint.status==="CANCELLED"){
        return res.status(400).json("Appointment already cancelled");
    }
    const currDate=new Date();
    if(new Date(foundAppoint.date)-currDate < 3600000){
        return res.status(400).json("Too late to cancel");
    }

    await prisma.$transaction(async (tx)=>{
        const updateAppoint=await tx.appointment.update({
            where:{
                id:parseInt(appointId)
            },
            data:{
                status:"CANCELLED"
            }
        });
        await tx.doctorSlot.updateMany({
            where:{
                doctorId:foundAppoint.doctorId,
                dateTime:foundAppoint.date
            },
            data:{
                isBooked:false
            }
        });
    });
    res.status(200).json("Appointment cancelled successfully"); 
}
catch(error){
    console.error("Cancellation error");
    res.status(500).json("Could not cancel the appointment");
}
});

module.exports=router;
