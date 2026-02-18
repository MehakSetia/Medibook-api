const express=require('express');
const router=express.Router();
const authenticationToken=require('../middleware/auth');
const {cancelAppoint, verifyAppoint, updateStatus,getAppoint,createAppoint}=require('../controllers/appointmentController');


router.post('/',authenticationToken,createAppoint);

router.patch('/:id/status',authenticationToken,updateStatus);

router.get('/',authenticationToken,getAppoint);

router.post('/cancel',authenticationToken,cancelAppoint);

router.post('/verify',authenticationToken,verifyAppoint);

module.exports=router;
