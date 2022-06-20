const path = require('path');
const multer  = require('multer')
const express = require('express');

const adminController = require('../controllers/admin');
// const {userAuth} = require('../controllers/admin');
const router = express.Router();
const passport = require('passport');
const {checkRole} = require('../middleware/is-auth');

const storage = multer.diskStorage({
    // destination: function (req, file, cb) {
    //   cb(null, '../public/images')
    // },
    destination: '../public/images',
    filename: function (req, file, cb) { 
      cb(null, Date.now()+ '_' +file.originalname )
    }
  })
const upload = multer({ storage })

router.post('/employees', adminController.getAllEmployee);
// router.post('/employees',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.getAllEmployee);

// router.post('/try', adminController.passportMidlleware, adminController.getAllEmployee);
router.post('/try', passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.getAllEmployee);


// register employee
router.post('/add-employee', adminController.AddEmployee);
// router.post('/add-employee',passport.authenticate('jwt', { session: false}),checkRole(['admin']), adminController.AddEmployee);
// router.post('/add-hr', adminController.postAddHr);
router.post('/delete-employee/:id', adminController.DeleteEmployee);
// router.get('/update-employee/:id', adminController.getUpdateEmployee);
router.post('/update-employee/:id', adminController.updateEmployee);
router.get('/get-employee/:id', adminController.getEmployeeById);
router.post('/assign-mentor', adminController.assignMentor);
router.post('/assign-supervisor', adminController.assignSupervisor);
router.post('/assign-buddy', adminController.assignBuddy);
router.post('/delete-mentor', adminController.deleteMentor);
router.post('/delete-supervisor', adminController.deleteSupervisor);
router.post('/delete-buddy', adminController.deleteBuddy);
// router.post('/update-mentor', adminController.updateMentor);

router.post('/add-generaltask', adminController.addGenTask);
// router.post('/add-generaltask',passport.authenticate('jwt', { session: false}),checkRole(['admin','employee'],['Hr']), adminController.addGenTask);

// router.post('/get-user-by-tasks', adminController.getUserByTask);
// router.post('/get-emp-by-tasks', adminController.getempByTask);
router.post('/viewEmployee/:id', adminController.viewEmployee);
router.post('/getAllTasks', adminController.getAllTasks);
router.post('/getTaskById/:id', adminController.getTaskById);
router.post('/getEmployee/:category', adminController.getEmployee);
router.post('/deleteTask/:id', adminController.deleteTask);
router.post('/updateTask/:id', adminController.updateTask);


module.exports = router;


