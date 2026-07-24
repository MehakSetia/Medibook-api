const express=require('express');
const router=express.Router();
const {getDocs,getDocSlots}=require('../controllers/doctorController');
const {authenticationToken,requireRole}=require('../middleware/auth');

router.get('/',authenticationToken,requireRole('PATIENT'),getDocs);

router.get('/:id/slots',authenticationToken,requireRole('PATIENT'),getDocSlots);


module.exports=router;