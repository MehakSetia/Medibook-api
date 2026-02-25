require('dotenv').config();
const express=require('express');
const setupSwagger = require('./config/swagger');
const app=express();
setupSwagger(app);
app.use(express.json());
const doctorRoutes=require('./routes/doctors');
const patientRoutes=require('./routes/patients');
const appointmentRoutes=require('./routes/appointments');
require('./jobs/cron');
const authRoutes=require('./routes/auth');
const scheduleRoutes=require('./routes/schedule');
const cors = require('cors');
app.use(cors());

app.use('/doctors',doctorRoutes);
app.use('/patients',patientRoutes);
app.use('/appointments',appointmentRoutes);
app.use('/auth',authRoutes);
app.use('/schedule',scheduleRoutes);

const PORT=3000;

app.listen(PORT,()=>{
  console.log(`MediBook running at port ${PORT}`);
});