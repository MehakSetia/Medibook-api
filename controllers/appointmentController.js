const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendAppointEmail, sendCancelEmail } = require('../services/email');
const { createAppointSchema, cancelAppointSchema, updateStatusSchema, verifyAppointSchema } = require('../validators/appointmentSchema');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const dayjs = require('dayjs');
const { tuple } = require('zod');

// In Docker, env vars are only available at runtime, not at the top-level module load. Any initialization that depends on env vars should be inside a function, not at the top of the file.

let razorpay;
const getRazorpay = () => {
    if (!razorpay) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
    return razorpay;
}


const createAppoint = async (req, res, next) => {
    try {
        const { date, doctorId } = req.body;
        createAppointSchema.parse(req.body);

        const id = await prisma.patient.findUnique({
            where: {
                userId: parseInt(req.user.userId)
            }
        });
        const parsedDate = new Date(date);

        const result = await prisma.$transaction(async (tx) => {

            const foundSlot = await prisma.doctorSlot.findFirst({
                where: {
                    doctorId: parseInt(doctorId),
                    dateTime: parsedDate
                }
            });
            if (!foundSlot) {
                return res.status(404).json("Doc not availabe");
            }
            if (foundSlot.isBooked === true) {
                return res.status(400).json("Slot already booked");
            }
            const doctor = await prisma.doctor.findUnique({
                where: {
                    id: parseInt(doctorId)
                }
            });

            if (!doctor) {
                return res.status(400).json("Doctor not found");
            }

            const options = {
                amount: doctor.price * 100,
                currency: "INR",
                receipt: "receipt_" + Date.now()
            };

            const order = await getRazorpay().orders.create(options);
            const newAppoint = await tx.appointment.create({
                data: {
                    doctorId: parseInt(doctorId),
                    patientId: parseInt(patient.id),
                    date: new Date(date),
                    status: "PENDING",
                    orderId: order.id
                },
                include: {
                    doctor: true,
                    patient: true
                }
            });
            await tx.doctorSlot.update({
                where: {
                    id: foundSlot.id
                },
                data: {
                    isBooked: true
                }
            });
            return { newAppoint, order };
        });
        const name = result.doctor.name;
        const mail = result.patient.email;
        sendAppointEmail(mail, name, result.date.toDateString());
        res.status(201).json({
            id: result.id,
            date: result.date,
            status: result.status,

            razorpayOrderId: order.id,
            amount: order.amount,
            currency: order.currency,

            doctor: {
                name: result.doctor.name,
                specialization: result.doctor.specialization
            },
            patient: result.patient.email
        });
    }
    catch (error) {
        return next(error);
    }
}


const verifyAppoint = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointId } = req.body;
        verifyAppointSchema.parse(req.body);
        let isValid = false;

        // data body (letter)
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // create seal
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)          // pick stamp
            .update(body.toString())      //pour wax
            .digest('hex');               //get result

        if (expectedSignature === razorpay_signature) {
            console.log("Signature matched");
            isValid = true;
        }
        else {
            console.log("Signature mismatch");
            isValid = false;
        }
        if (isValid) {
            const updateAppoint = await prisma.appointment.update({
                where: {
                    id: parseInt(appointId)
                },
                data: {
                    status: "CONFIRMED",
                    paymentId: razorpay_payment_id
                }
            });
            res.status(200).json({
                success: true,
                message: "Payment Verified Successfully",
                appointId: updateAppoint.id
            });
        }
        else {
            res.status(400).json({
                success: false,
                message: "Invalid Signature.Payment failed"
            });
        }
    }

    catch (error) {
        return next(error);
    }
}

const getAppoint = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { userId, role } = req.user;
        let comingAppoint = [];
        if (role === "PATIENT") {
            const foundId = await prisma.patient.findUnique({
                where: {
                    userId: parseInt(userId)
                }
            });
            comingAppoint = await prisma.appointment.findMany({
                where: {
                    patientId: foundId.id,
                },
                select: {
                    id: true,
                    status: true,
                    date: true,
                    doctor: {
                        select: {
                            name: true,
                            specialization: true
                        }
                    }
                },
                orderBy: { date: 'asc' }
            });
        }
        else if (role === "DOCTOR") {
            const foundId = await prisma.doctor.findUnique({
                where: {
                    userId: parseInt(userId),
                }
            });
            comingAppoint = await prisma.appointment.findMany({
                where: {
                    doctorId: foundId.id,
                },
                select: {
                    id: true,
                    status: true,
                    date: true,
                    patient: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { date: 'asc' }
            });
        }
        res.json(comingAppoint);
    }
    catch (error) {
        return next(error);
    }
}

const cancelAppoint = async (req, res, next) => {
    try {
        const { appointId } = req.body;
        cancelAppointSchema.parse(req.body);
        let refundId = null;

        const foundAppoint = await prisma.appointment.findFirst({
            where: {
                id: parseInt(appointId)
            },
            select: {
                id: true,
                status: true,
                paymentId: true,
                doctorId: true,
                date: true,
                patient: {
                    select: {
                        userId: true,
                        email: true
                    }
                },
                doctor: {
                    select: {
                        name: true,
                        phone: true
                    }
                }
            }

        });
        if (!foundAppoint) {
            return res.status(404).json("Appointment not found");
        }
        if (parseInt(foundAppoint.patient.userId) !== parseInt(req.user.userId)) {
            return res.status(403).json("You don't own this appointment");
        }
        if (foundAppoint.status === "CANCELLED") {
            return res.status(400).json("Appointment already cancelled");
        }
        const currDate = dayjs();
        const appointDate = dayjs(foundAppoint.date);
        const diffHour = appointDate.diff(currDate, 'hour');
        if (diffHour < 1) {
            return res.status(400).json("Too late to cancel");
        }

        if (foundAppoint.status === "CONFIRMED" && foundAppoint.paymentId) {
            try {
                const paymentDetails = await getRazorpay().payments.fetch(foundAppoint.paymentId);
                const refund = await getRazorpay().payments.refund(
                    foundAppoint.paymentId, {
                    amount: paymentDetails.amount,
                    notes: {
                        reason: "Patient cancelled within time limit",
                        appointId: foundAppoint.id
                    }
                });
                refundId = refund.id;
            }
            catch (razorError) {
                if (razorError.error?.description?.includes("already refunded")) {
                    console.log("Payment was already refunded on Razorpay. Syncing DB...");
                }
                else {
                    throw razorError; // Real error, stop here
                }
            }
        }


        await prisma.$transaction(async (tx) => {



            await tx.appointment.update({
                where: {
                    id: parseInt(appointId)
                },
                data: {
                    status: "CANCELLED",
                    refundId: refundId
                }
            });
            await tx.doctorSlot.updateMany({
                where: {
                    doctorId: foundAppoint.doctorId,
                    dateTime: foundAppoint.date
                },
                data: {
                    isBooked: false
                }
            });
        });
        const dateString = new Date(foundAppoint.date).toDateString();

        await sendCancelEmail(
            foundAppoint.patient.email,
            foundAppoint.doctor.name,
            dateString,
            foundAppoint.doctor.phone
        );
        return res.status(200).json(`Appointment Cancelled and refund initiated: ${refundId}`);

    }
    catch (error) {
        return next(error);
    }
}

const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        updateStatusSchema.parse(req.body);

        if (status === "CANCELLED") {
            return res.status(400).json("Use /cancel routes to cancel appointments");
        }

        const foundAppoint = await prisma.appointment.update({
            where: {
                id: parseInt(id)
            },
            data: {
                status: status
            },
            select: {
                id: true,
                status: true,
                date: true
            }
        });

        return res.json(foundAppoint);
    }
    catch (error) {
        return next(error);
    }

}


module.exports = {
    cancelAppoint,
    createAppoint,
    verifyAppoint,
    getAppoint,
    updateStatus
};
