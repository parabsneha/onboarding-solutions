const express = require('express');
const router = express.Router();
const path = require('path');
const employeeController = require('../controllers/employee');
const passport = require('passport');
const {authEmployee} = require('../middleware/is-auth');

router.post('/update',passport.authenticate('jwt', { session: false}),authEmployee(['employee','admin']), employeeController.employeeUpdate);
router.post('/getMyTeam',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getMyTeam);

router.post('/mydetails',passport.authenticate('jwt', { session: false}),authEmployee(['employee','admin']), employeeController.getMyDetails);

router.post('/myBuddies',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.myBuddies);


router.post('/getSessionInfo/:id',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getSessionInfo);

router.post('/countByStatus',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.countByStatus);

router.post('/getTaskByIdEmp/:id',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getTaskByIdEmp);
router.post('/getTaskById/:id',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getTaskById);

router.post('/submitLike/:id',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.submitLike);
router.post('/current-day-task',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.curentDayTask);
router.post('/coming-week-task',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.comingWeekTask);
router.post('/getpersonResponsible',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getpersonResponsible);
router.post('/coming-month-task',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.comingMonthTask);
router.post('/getEditTask',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getEditTask);
router.post('/editTask',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.postEditTask);
router.post('/getMentors',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getMentors);
router.post('/getSupervisor',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getSupervisor);
router.post('/getBuddy',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getBuddy);
router.post('/getSupTeam',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.getSupTeam);
router.post('/editAllTaskSup',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.editAllTaskSup);
router.post('/MyTasksSupervisor',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.MyTasksSupervisor);
router.post('/fetchAnnouncement',passport.authenticate('jwt', { session: false}),authEmployee(['employee']), employeeController.fetchAnnouncement);
router.post('/supervisorFeedback', employeeController.supervisorFeedback);



module.exports = router;

