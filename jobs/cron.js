const cron=require('node-cron');
const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient();


cron.schedule('* * * * *',async ()=>{
    console.log("Running Cron Job: Cleanup Pending Appointments");

   const thirtyMinsAgo=new Date(Date.now()-30*60*1000);  

   try{
    const result=await prisma.appointment.updateMany({
        where:{
            status:"PENDING",
            createdAt:{
                lt:thirtyMinsAgo
            }
        },
        data:{
            status:"CANCELLED"
        }
    });
    console.log(`Updated ${result.count} appointments.`);
   }
   catch(error){
    console.error("Error in cron job",error);
   }
});

module.exports=cron;