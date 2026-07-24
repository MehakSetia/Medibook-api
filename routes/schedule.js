const express=require('express');
const router=express.Router();
const {createSchedule,getSlots,deleteSlots}=require('../controllers/scheduleContoller');
const {authenticationToken,requireRole}=('../middleware/auth');


router.post('/create',authenticationToken,requireRole('DOCTOR'),createSchedule);

router.get('/:doctorId',authenticationToken,getSlots);

router.delete('/remove/:slotId',authenticationToken,requireRole('DOCTOR'),deleteSlots);



module.exports=router;