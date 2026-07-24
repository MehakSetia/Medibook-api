const z=require('zod');

const createAppointSchema=z.object({
    doctorId:z.number(),
    date:z.string().datetime()
});

const cancelAppointSchema=z.object({
    appointId:z.number()
});

const verifyAppointSchema=z.object({
    razorpay_order_id:z.string(),
    razorpay_payment_id:z.string(),
    razorpay_signature:z.string(),
    appointId:z.number()
});

const updateStatusSchema=z.object({
    status:z.enum(
        ['PENDING','CONFIRMED','CANCELLED']
    )
});

module.exports={
    createAppointSchema,cancelAppointSchema,updateStatusSchema,verifyAppointSchema
};