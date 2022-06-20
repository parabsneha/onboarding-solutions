const { json } = require('express/lib/response');
const { use } = require('../app');
require('../DB/Connection');
const Employee = require("../models/employee");
const bcrypt = require('bcryptjs');
const Mentor = require('../models/mentor');
const Buddy = require('../models/buddy');
const Supervisor = require('../models/supervisor');
const generalTask = require('../models/generalTask');
const { populate } = require('../models/employee');
const employeeTask = require('../models/employeeTask');
const compare = require("compare");

const moment = require('moment');


exports.employeeUpdate = (req, res, next) => {
  const empId = req.user._id;
  const empFirstName = req.body.empFirstName;
  const empLastName = req.body.empLastName;
  const empEmail = req.body.empEmail;
  const empPassword = req.body.empPassword;
  const empConfirmPass = req.body.empConfirmPass;
  const empContactNum = req.body.empContactNum;
  const gender = req.body.gender;
  Employee.findById(empId)
    .then(employee => {
      employee.empFirstName = empFirstName;
      employee.empLastName = empLastName;
      employee.empEmail = empEmail;
      employee.empPassword = empPassword;
      employee.empConfirmPass = empConfirmPass;
      employee.empContactNum = empContactNum;
      employee.gender = gender;
      return employee.save();
    })
    .then(result => {
      res.status(201).json({ message: result });
    })
    .catch(err => {
      res.status(500).json({ error: "failed to update" });
    });
};

exports.getMyTeam = (req, res, next) => {
  // const empTeam = req.session.user.empTeam;
  const empTeam = req.user.empTeam;
  console.log(empTeam);

  Employee.find({ empTeam: empTeam }, (err, docs) => {
    if (!err) {
      res.json({ data: docs });
      console.log(docs);
    } else {
      res.json({
        message: 'Failed to retrieve the employee List: ',
        error: err
      });
    }
  });
};

exports.getBuddy = (req, res, next) => {
  // console.log("user id ", req.user._id);
  const buddies = [];
  Buddy.find()
    .populate('buddy.buddy_id', 'empFirstName')
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        for (i in result) {
          if (result[i].employee.toString() === req.user._id.toString()) {
            for (j in result[i].buddy) {
              buddies.push({
                buddy: result[i].buddy[j].buddy_id.empFirstName,
                date: result[i].buddy[j].date
              })
            }
          }
        }
        res.send(buddies);
      }
    });
};

exports.getSupervisor = (req, res, next) => {
  const supervisors = [];
  Supervisor.find()
    .populate('supervisor.supervisor_id', 'empFirstName')
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        for (i in result) {
          if (result[i].employee.toString() === req.user._id.toString()) {
            for (j in result[i].supervisor) {
              supervisors.push({
                supervisor: result[i].supervisor[j].supervisor_id.empFirstName,
                date: result[i].supervisor[j].date
              })
            }
          }
        }
        res.status(200).send(supervisors);
      }
    });
};


exports.getMyDetails = (req, res, next) => {
  const empid = req.user._id;
  Employee.findById(empid)
    .then(employee => {
      console.log(employee);
      res.send(employee);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getMentors = (req, res, next) => {
  console.log("user id ", req.user._id);
  const mentees = [];
  Mentor.find()
    .populate('mentor.mentor_id', 'empFirstName')
    .exec((err, result) => {
      if (err) {
        console.log(err);
      } else {
        for (i in result) {
          if (result[i].employee.toString() === req.user._id.toString()) {
            for (j in result[i].mentor) {
              mentees.push({
                mentor: result[i].mentor[j].mentor_id.empFirstName,
                date: result[i].mentor[j].date
              })
            }
          }
        }
        res.status(200).send(mentees);
        // }
      }
    });
  // .catch(err => console.log(err));
}

// exports.myTasks = (req, res, next)=>{
//   Employee.findById(req.session.user._id)
//   .populate('assignedTaskList.tasks.taskid')
//   .exec((err, employee) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(employee.assignedTaskList.tasks);
//       res.send(employee);
//     }
//   });
// }


exports.comingMonthTask = (req, res, next) => {
  employeeTask.findOne({ user: req.user._id })
    .then((employeeTask) => {
      const taskDetails = [];
      for (i in employeeTask.task) {
        let taskDate = moment(employeeTask.task[i].date).format("YYYY-MM-DD");
        var stringDate = taskDate.split('-');
        const taskMonth = Number(stringDate[1]);
        const taskYear = Number(stringDate[0]);
        if (taskMonth == new Date().getMonth() + 2 && taskYear == new Date().getFullYear()) {

          taskDetails.push({
            taskid:  employeeTask.task[i].task_id,
            type:  employeeTask.task[i].type,
            topic: employeeTask.task[i].topic,
            objective: employeeTask.task[i].objective,
            category: employeeTask.task[i].category,
            status: employeeTask.task[i].status,
            date: moment(employeeTask.task[i].date).format("DD-MM-YYYY"),
            personResponsible: employeeTask.task[i].personResponsible,
            sessionRating: employeeTask.task[i].sessionRating,
            sessionFeedbackComments: employeeTask.task[i].sessionFeedbackComments,
            estimatedTime: employeeTask.task[i].estimatedTime,
            supervisorFeedbackComments: employeeTask.task[i].supervisorFeedbackComments
          });
        }
      }
      if (taskDetails.length === 0) {
        res.status(204).send("sorry! nothing to fetch");
      }
      else {
        // res.json({ message: taskDetails });
        console.log(taskDetails);
        res.status(200).send(taskDetails);
      }
    })
    .catch(err => console.log(err));
};

exports.comingWeekTask = (req, res, next) => {
  employeeTask.findOne({ user: req.user._id })
    .then((employeeTask) => {

      var today = new Date(); // get current date
      var first = today.getDate() - today.getDay() + 7; // First day is the day of the month - the day of the week (monday)
      var last = first + 6 + 2; // last day is the first day + 6 (sunday)

      var firstday = new Date(today.setDate(first));
      var lastday = new Date(today.setDate(last));

      const formattdFirstDate = moment(firstday).format("MM DD YYYY");
      const formattedLastDate = moment(lastday).format("MM DD YYYY");
      console.log("the date ", formattedLastDate);

      const taskDetails = [];
      for (i in employeeTask.task) {
        const taskDate = moment(employeeTask.task[i].date).format("MM DD YYYY");
        var taskYear = taskDate.split(" ");
        taskYear = taskYear[2];
        if (compare(formattedLastDate, taskDate) == 1 && compare(taskDate, formattdFirstDate) == 1 && taskYear == today.getFullYear()) {
          taskDetails.push({
            taskid:  employeeTask.task[i].task_id,
            type:  employeeTask.task[i].type,
            topic: employeeTask.task[i].topic,
            objective: employeeTask.task[i].objective,
            category: employeeTask.task[i].category,
            status: employeeTask.task[i].status,
            date: moment(employeeTask.task[i].date).format("DD-MM-YYYY"),
            personResponsible: employeeTask.task[i].personResponsible,
            sessionRating: employeeTask.task[i].sessionRating,
            sessionFeedbackComments: employeeTask.task[i].sessionFeedbackComments,
            estimatedTime: employeeTask.task[i].estimatedTime,
            supervisorFeedbackComments: employeeTask.task[i].supervisorFeedbackComments
          });
        }
      }
      if (taskDetails.length === 0) {
        res.status(204).send("sorry! nothing to fetch");
      }
      else {
        // res.json({ message: taskDetails });
        res.status(200).send(taskDetails);
      }
    })
    .catch(err => console.log(err));
};

//view task  general task for admin to check into ---employeetask for employees
exports.getTaskById = (req, res, next) => {
  const taskid = req.params.id;
  console.log("task - id ", taskid);
  employeeTask.findOne({ user: req.user._id })
    .then((employeeTask) => {
      const taskDetails = [];
      for (i in employeeTask.task) {
        if(employeeTask.task[i].task_id == taskid){
        taskDetails.push({
          task_id: employeeTask.task[i].task_id,
          type:  employeeTask.task[i].type,
          topic: employeeTask.task[i].topic,
          objective: employeeTask.task[i].objective,
          date:  moment(employeeTask.task[i].date).format("DD-MM-YYYY"),
          estimatedTime: employeeTask.task[i].estimatedTime,
          sessionRating: employeeTask.task[i].sessionRating,
          status: employeeTask.task[i].status,
          sessionFeedbackComments: employeeTask.task[i].sessionFeedbackComments
        });
      }
      }
      res.send(taskDetails);
    })
    .catch(err => {
      console.log(err);
    });
};

//list of all tasks assigned to the employee
exports.getEditTask = (req, res, next) => {
  employeeTask.findOne({ user: req.user._id })
    .then((employeeTask) => {
      const taskDetails = [];
      for (i in employeeTask.task) {
        taskDetails.push({
          task_id: employeeTask.task[i].task_id,
          type:  employeeTask.task[i].type,
          topic: employeeTask.task[i].topic,
          category:employeeTask.task[i].category,
          objective: employeeTask.task[i].objective,
          date:  moment(employeeTask.task[i].date).format("DD-MM-YYYY"),
          estimatedTime: employeeTask.task[i].estimatedTime,
          sessionRating: employeeTask.task[i].sessionRating,
          status: employeeTask.task[i].status,
          sessionFeedbackComments: employeeTask.task[i].sessionFeedbackComments
        });
      }
      // res.json({ message: taskDetails });
      res.status(200).send(taskDetails);
    })
    .catch(err => console.log(err));
};

//for person responsible eg- hr or supervisor
exports.getEditTaskForUser = (req, res, next) => {
  employeeTask.findOne({personResponsible:req.session.user._id, user:req.body.user_id})
  .then((employeeTask) => {
    const taskDetails = [];
    for (i in employeeTask.task){
      taskDetails.push({
        task_id:employeeTask.task[i].task_id,
        type:  employeeTask.task[i].type,
        topic:employeeTask.task[i].topic,
        objective:employeeTask.task[i].objective,
        date: moment(employeeTask.task[i].date).format("DD-MM-YYYY"),
        estimatedTime:employeeTask.task[i].estimatedTime,
        feedbackComments:employeeTask.task[i].feedbackComments,
        status:employeeTask.task[i].status,
        summaryComments:employeeTask.task[i].summaryComments        
      });
    }
    // res.json({message: taskDetails});
    res.status(200).send(taskDetails);
  })
  .catch(err => console.log(err));
};

//for person responsible eg- hr or supervisor
exports.postEditTaskForUser = (req, res, next) => {
  employeeTask.findOne({'personResponsible':req.session.user._id, 'user':req.body.user_id})
  .then((employeeTask) => {
    for (i in employeeTask.task){
      if(employeeTask.task[i].task_id == req.body.task_id && employeeTask.task[i].type=="session"){
        employeeTask.task[i].supervisorFeedbackComments = req.body.supervisorFeedbackComments;
        // employeeTask.task[i].objective = req.body.objective;
        // employeeTask.task[i].estimatedTime = req.body.estimatedTime;
    }
    else{
      res.status(403).send("cant process the request");
    }
    }
    employeeTask.save();
    res.status(200).send(employeeTask);
  })
  .catch(err => console.log(err));
};


exports.postEditTask = (req, res, next) => {
  employeeTask.findOne({ user: req.user._id })
    .then((employeeTask) => {
      for (i in employeeTask.task) {
        if (employeeTask.task[i].task_id == req.body.task_id ) {
          if(employeeTask.task[i].type=="session"){
            employeeTask.task[i].sessionRating = req.body.sessionRating;
            employeeTask.task[i].status = req.body.status;
            employeeTask.task[i].sessionFeedbackComments = req.body.sessionFeedbackComments;
          }else{
            employeeTask.task[i].status = req.body.status;
          }
        }else{
          return res.status(403).send("cant process the request");
        }
      }
      employeeTask.save();
      // res.json({ message: employeeTask });
      res.status(200).send(employeeTask);
    })
    .catch(err => console.log(err));
};


exports.getpersonResponsible = (req, res, next) => {
  employeeTask.findOne({ user: req.user._id })
    .populate('task.personResponsible', 'empFirstName')
    .exec((err, employeeTask) => {
      if (err) {
        console.log(err);
      } else {
        console.log(employeeTask.task.personResponsible);
        res.send(employeeTask);
      }
    });
};
// ----------------------------------------------
// exports.addnewTask = (req, res, next) => {

//   const title = req.body.title;
//   const description = req.body.description;
//   const category = req.body.category;
//   const assignedBy = req.session.user._id
//   const estimatedTime = req.body.estimatedTime;
//   const url = req.body.url;
//   const startDate = req.body.startDate;
//   const endDate = req.body.endDate;
//   // const onModel = 'Employee';
//   console.log(req.session.user._id);
//   const genTask = new generalTask({ title, description, category, assignedBy, estimatedTime, url, startDate, endDate });
//   genTask.save()
//     .then((genTask) => {
//       console.log("task created");
//       res.send(genTask);
//     })
//     .catch(err => console.log(err));
// };


// ====================================

exports.curentDayTask = (req, res, next) => {
  employeeTask.findOne({ user: req.user._id })
    .then((employeeTask) => {
      const taskDetails = [];
      var date = new Date().toLocaleDateString();
      for (i in employeeTask.task) {
        const taskDate1 = moment(employeeTask.task[i].date).format("YYYY-MM-DD");
        var stringDate = taskDate1.split('-');
        const taskMonth = Number(stringDate[1]);
        const newdate = employeeTask.task[i].date.toLocaleDateString();
        if (newdate == date && taskMonth == new Date().getMonth() + 1) {
          taskDetails.push({
            taskid:  employeeTask.task[i].task_id,
            type:  employeeTask.task[i].type,
            topic: employeeTask.task[i].topic,
            objective: employeeTask.task[i].objective,
            category: employeeTask.task[i].category,
            status: employeeTask.task[i].status,
            date: moment(employeeTask.task[i].date).format("DD-MM-YYYY"),
            personResponsible: employeeTask.task[i].personResponsible,
            sessionRating: employeeTask.task[i].sessionRating,
            sessionFeedbackComments: employeeTask.task[i].sessionFeedbackComments,
            estimatedTime: employeeTask.task[i].estimatedTime,
            supervisorFeedbackComments: employeeTask.task[i].supervisorFeedbackComments
          });
        }
      }
      if (taskDetails.length === 0) {
        res.status(204).send("sorry! nothing to fetch");
        // res.json({ message: "sorry! there is no assigned tasks for today" });
      }
      else {
        // res.json({ message: taskDetails });
        res.status(200).send(taskDetails);
      }
    })
    .catch(err => console.log(err));
};