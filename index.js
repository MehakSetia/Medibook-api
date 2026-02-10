require('dotenv').config();
const express=require('express');
const app=express();
app.use(express.json());
const doctorRoutes=require('./routes/doctors');
const patientRoutes=require('./routes/patients');
const appointmentRoutes=require('./routes/appointments');
// require('./jobs/cron');
const authRoutes=require('./routes/auth');
const scheduleRoutes=require('./routes/schedule');

app.use('/doctors',doctorRoutes);
app.use('/patients',patientRoutes);
app.use('/appointments',appointmentRoutes);
app.use('/auth',authRoutes);
app.use('/schedule',scheduleRoutes);

const PORT=3000;

app.listen(PORT,()=>{
  console.log(`MediBook running at port ${PORT}`);
});