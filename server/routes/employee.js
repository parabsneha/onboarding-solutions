const express = require('express');
const router = express.Router();
const path = require('path');
const employeeController = require('../controllers/employee');
const passport = require('passport');
const {authEmployee} = require('../middleware/is-auth');

router.post('/update', employeeController.employeeUpdate);
// router.post('/login/:id', employeeController.employeeLogin);
router.get('/getMyTeam',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getMyTeam);

router.post('/mydetails',passport.authenticate('jwt', { session: false}),authEmployee(['employee','admin']), employeeController.getMyDetails);

// router.get('/getMentor',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getMentor);

// router.post('/getTaskById/:id', employeeController.getTaskById);

router.post('/getTaskById/:id',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getTaskById);
// router.get('/edit-taskstatus', employeeController.editTaskStatus);
router.post('/current-day-task',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.curentDayTask);
router.post('/coming-week-task',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.comingWeekTask);
router.post('/getpersonResponsible',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getpersonResponsible);
router.post('/coming-month-task',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.comingMonthTask);
router.post('/getEditTask',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getEditTask);
router.post('/editTask',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.postEditTask);
router.post('/getMentors',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getMentors);
router.post('/getSupervisor',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getSupervisor);
router.post('/getBuddy',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getBuddy);

// router.post('/addTask', employeeController.addnewTask);


module.exports = router;

