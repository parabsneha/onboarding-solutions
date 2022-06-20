const express = require('express');

const authController = require('../controllers/auth');
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth')


const router = express.Router();

router.post('/login',authController.postLogin);
// router.post('/loginhr',authController.postLoginHr);
// router.post('/logout', authController.postLogout);

module.exports = router;    
