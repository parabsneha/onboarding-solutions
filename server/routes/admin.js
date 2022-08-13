const path = require('path');
const multer  = require('multer')
const express = require('express');

const adminController = require('../controllers/admin');
const router = express.Router();
const passport = require('passport');
const {checkRole} = require('../middleware/is-auth');

const storage = multer.diskStorage({

    destination: '../public/images',
    filename: function (req, file, cb) { 
      cb(null, Date.now()+ '_' +file.originalname )
    }
  })
const upload = multer({ storage })

router.post('/employees', adminController.getAllEmployee);
router.post('/fetchBlog', adminController.fetchBlog);
router.post('/createBlog', passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.createBlog);
router.post('/try', passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.getAllEmployee);
router.post('/taskCount', adminController.noOfTasks);
router.post('/employeeCount',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.noOfEmployees);
router.post('/makeAnnouncement',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.makeAnnouncement);
router.post('/fetchAnnouncement',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.fetchAnnouncement);

router.post('/add-employee', adminController.AddEmployee);
router.post('/delete-employee/:id',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.DeleteEmployee);
router.post('/update-employee', adminController.updateEmployee);
router.get('/get-employee/:id', adminController.getEmployeeById);
router.post('/assign-mentor', adminController.assignMentor);
router.post('/assign-supervisor', adminController.assignSupervisor);
router.post('/assign-buddy', adminController.assignBuddy);
router.post('/delete-mentor', adminController.deleteMentor);
router.post('/delete-supervisor', adminController.deleteSupervisor);
router.post('/delete-buddy', adminController.deleteBuddy);
router.post('/getEmpSupervisor/:id', adminController.getEmployeeSupervisor);
router.post('/getEmpBuddy/:id', adminController.getEmployeeBuddy);
router.post('/getEmpMentor/:id', adminController.getEmployeeMentor);

router.post('/getPersonResponsible',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.getPersonResponsible);
router.post('/getSupervisorList/:id', adminController.getSupervisorList);
router.post('/add-generaltask',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.addGenTask);

router.post('/viewEmployee/:id', adminController.viewEmployee);
router.post('/getAllTasks',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.getAllTasks);
router.post('/getTaskById/:id', adminController.getTaskById);
router.post('/getEmployee/:category', adminController.getEmployee);
router.post('/deleteTask/:id',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.deleteTask);
router.post('/updateTask/:id',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.updateTask);


module.exports = router;


