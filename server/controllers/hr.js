const Task = require('../models/tasks');
const Employee = require('../models/employee');
const Hr = require('../models/Hr');
const nodemailer = require('nodemailer');
const generalTask = require('../models/generalTask');
const employeeTask = require('../models/employeeTask');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "par007@chowgules.ac.in",
    pass: "su170277",
  }
});
// exports.createTask = (req, res, next) => {
//   const title = req.body.title;
//   const description = req.body.description;
//   const assignTo = req.body.assignTo;
//   const url = req.body.url;
//   const startDate = req.body.startDate;
//   const endDate = req.body.endDate;
//   console.log(req.session.user._id);
//   const task = new Task({ title, description, assignTo, url, startDate, endDate });
//   task.save()
//     .then((task) => {
//       console.log("task created");
//       Employee.findById(req.body.assignTo)
//         .then(employee => {
//           Hr.findById(req.session.user._id)  //was changed from req.session.hr._id to req.session.user._id
//             .then(hr => {
//               return hr.addToTasksList(task, employee._id);
//             })
//             .catch(err => console.log(err));
//           const onModel = "Task";
//           return employee.addToTasksList(task, onModel);
//         })
//         .then(result => {
//           var mailOptions = {
//             from: "par007@chowgules.ac.in",
//             to: result.empEmail,
//             subject: 'New task has been assigned',
//             text: "You have been assigned a new task by your HR. \n\n Regards, \n" + "HR: " +
//               req.session.user.firstName + " " +
//               req.session.user.lastName + ""
//           };
//           transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//               console.log(error);
//             } else {
//               console.log('email sent:' + info.response);
//             }
//           })
//           res.send("task assigned");
//         })
//         .catch(err => console.log(err));
//     })
//     .catch(err => console.log(err));
// };

exports.myTasks = (req, res, next) => {
  console.log( req.user);
  generalTask.find({personResponsible: req.user._id})
  .then((task)=>{
    res.status(200).json(task);
  }).catch(err => console.log(err));
}

exports.getEditTaskForUser = (req, res, next) => {
  console.log("person res ",req.user._id);
  console.log("user ", req.body.user_id);
  employeeTask.findOne({user:req.body.user_id})
  .then((employeeTask) => {
    const taskDetails = [];
    for (i in employeeTask.task){
      if(employeeTask.task[i].personResponsible.toString() == req.user._id.toString()){
        console.log("task = ",employeeTask.task[i].task_id);
      taskDetails.push({
        task_id: employeeTask.task[i].task_id,
        topic: employeeTask.task[i].topic,
        objective: employeeTask.task[i].objective,
        status: employeeTask.task[i].status,
        date: employeeTask.task[i].date,
        personResponsible: employeeTask.task[i].personResponsible,
        sessionRating: employeeTask.task[i].sessionRating,
        sessionFeedbackComments: employeeTask.task[i].sessionFeedbackComments,
        estimatedTime: employeeTask.task[i].estimatedTime,
        supervisorFeedbackComments: employeeTask.task[i].supervisorFeedbackComments
      });
    }
  }
    res.json({message: taskDetails});
  })
  .catch(err => console.log(err));
};

exports.postEditTaskForUser = (req, res, next) => {
  employeeTask.findOne({'personResponsible':req.user._id, 'user':req.body.user_id})
  .then((employeeTask) => {
    for (i in employeeTask.task){
      if(employeeTask.task[i].task_id == req.body.task_id){
        employeeTask.task[i].topic = req.body.topic;
        employeeTask.task[i].objective = req.body.objective;
        employeeTask.task[i].estimatedTime = req.body.estimatedTime;
        employeeTask.task[i].supervisorFeedbackComments =req.body.supervisorFeedbackComments;
    }
    }
    employeeTask.save();
    res.json({message: employeeTask});
  })
  .catch(err => console.log(err));
};

