const { Prisma } = require('@prisma/client');
const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        
        user: 'bxbcobr2gqxsap2f@ethereal.email', 
        pass: 'YCRxwHFM92rKpgxJTe'         
    }
});

const sendAppointEmail=async(patientEmail,docName,date)=>{
    try{
        const info=await transporter.sendMail({
            from: `"MediBook System" <system@medibook.com>`,
            to: patientEmail,
            subject: "Appointment Confirmed",
            html: `
            <h3>Hello!</h3>
            <p>Your appointment with <b>${docName}</b> is confirmed.</p>
            <p>Date: ${date}</p>
            <br>
            <p>Thank you,<br>MediBook Team</p>
            `
        });
        console.log("Email sent: %s",info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    catch(error){
        console.error("Error sending email: ",error);
    }
}
module.exports={ sendAppointEmail };