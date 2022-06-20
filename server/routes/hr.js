const express = require('express');
const router = express.Router();
// const isAuth = require('../middleware/is-auth')
const {authEmployee} = require('../middleware/is-auth');
const hrController = require('../controllers/hr');

const passport = require('passport');
const {checkRole} = require('../middleware/is-auth');

// router.post('/create-task', hrController.createTask); 
router.post('/my-task',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), hrController.myTasks); 
router.get('/editTask',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), hrController.getEditTaskForUser);
router.post('/editTask',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), hrController.postEditTaskForUser);

module.exports = router;