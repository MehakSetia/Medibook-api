require('dotenv').config();
const express=require('express');
const helmet=require('helmet');
const rate=require('express-rate-limit');
const limiter=rate({
  windowMs:15*60*1000,
  max:100
});
const setupSwagger = require('./config/swagger');
const app=express();
setupSwagger(app);
app.use(express.json());
app.use(helmet());
const doctorRoutes=require('./routes/doctors');
const appointmentRoutes=require('./routes/appointments');
require('./jobs/cron');
const authRoutes=require('./routes/auth');
const scheduleRoutes=require('./routes/schedule');
const cors = require('cors');
app.use(cors());


app.use('/doctors',doctorRoutes);
app.use('/appointments',appointmentRoutes);
app.use('/auth',authRoutes);
app.use('/schedule',scheduleRoutes);

const errorHandler=require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is officially live on port ${PORT}`);
});