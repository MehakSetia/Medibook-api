const express=require('express');
const router=express.Router();
const {authenticationToken,requireRole}=require('../middleware/auth');
const {cancelAppoint, verifyAppoint, updateStatus,getAppoint,createAppoint}=require('../controllers/appointmentController');



router.post('/', authenticationToken, requireRole('PATIENT'), createAppoint);
router.patch('/:id/status', authenticationToken, requireRole('DOCTOR'), updateStatus);
router.get('/', authenticationToken, getAppoint); 
router.post('/cancel', authenticationToken, requireRole('PATIENT'), cancelAppoint);
router.post('/verify', authenticationToken, requireRole('PATIENT'), verifyAppoint);


module.exports=router;
