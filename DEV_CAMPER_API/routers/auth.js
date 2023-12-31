const express = require('express');

const { 
    register, 
    login, 
    getMe, 
    forgotPassword, 
    resetPassword,
    updateDetails,
    updatePassword
 } = require('../controllers/auth');

const {protect} = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/me', protect, getMe);

router.put('/updatedetails', protect, updateDetails);

router.put('/updatepassword', protect, updatePassword);

router.post('/forgotPassword', protect, forgotPassword);

router.put('/resetpassword/:resetToken', resetPassword);

module.exports = router;