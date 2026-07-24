const z=require('zod');

const createScheduleSchema=z.object({
    date:z.string().date(),
    startTime:z.string().time(),
    endTime:z.string().time()
}).superRefine((data,ctx)=>{
    const start=parseInt(data.startTime.split(':')[0]);
    const end=parseInt(data.endTime.split(':')[0]);
    if(start>=end){
        ctx.addIssue({path:["endTime"],message:"End time must be after start time",code:"custom"});
    }
});

module.exports={createScheduleSchema};