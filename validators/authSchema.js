const z=require('zod');

const registerSchema=z.object({
    name:z.string().min(2),
    email:z.email(),
    password:z.string().min(8),
    role:z.enum(
        ["PATIENT","DOCTOR"]
    ),
    mobile:z.string().optional(),
    specialization:z.string().optional(),
    price:z.number().optional(),
    phone:z.string().optional()
}).superRefine((data,ctx)=>{
    if(data.role==="DOCTOR"){
        if(!data.specialization) ctx.addIssue({path:["specialization"],message:"Required for doctors",code:"custom"});
        if(!data.price) ctx.addIssue({path:["price"],message:"Required for doctors",code:"custom"});
        if(!data.phone) ctx.addIssue({path:["phone"],message:"Required for doctors",code:"custom"});
    }
    if(data.role==="PATIENT"){
        if(!data.mobile) ctx.addIssue({path:["mobile"],message:"Required for patients",code:"custom"});
    }
});

const loginSchema=z.object({
    email:z.email(),
    password:z.string().min(8)
});

module.exports={registerSchema,loginSchema};