
const { PrismaClient }=require('@prisma/client');
const prisma=new PrismaClient();


const getDocs=async (req,res,next)=>{
  try{
    const docs=await prisma.doctor.findMany({
      select: {
    id: true,
    name: true,
    specialization: true,
    price: true,
    phone: true,
  }
    });
    return res.json(docs);
  }
  catch(error){
    return next(error);
  }
};

const getDocSlots=async(req,res,next)=>{
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
    return res.json(foundSlot);
  }
  catch(error){
    return next(error);
  }
};

module.exports={getDocs,getDocSlots};