const { Resend } =require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);


const sendAppointEmail=async(patientEmail,docName,date)=>{
    try{
        const info=await resend.emails.send({
            from: `"MediBook System" <onboarding@resend.dev>`,
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
       
    }
    catch(error){
        console.error("Error sending email: ",error);
    }
}

const sendCancelEmail=async(patientEmail,docName,date,phone)=>{
   try{
    const info=await resend.emails.send({
        from: `"MediBook System" <onboarding@resend.dev>`,
            to: patientEmail,
            subject: "Appointment Cancelled & Refund Initiated",
            html: `
            <h3>Hello!</h3>
            <p>Your appointment with <b>${docName}</b> is cancelled and amount is refunded.
            <br>If not yet refunded please wait for sometime.</p>
            <p>Date: ${date}</p>
            <br><p>Contact at: ${phone}</p>
            <p>Thank you,<br>MediBook Team</p>
            `
    });
    
   }
   catch(error){
    console.error("Error sending email: ",error);
   }
}

module.exports={ sendAppointEmail,sendCancelEmail };