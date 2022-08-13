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
const Blog = require('../models/blog');
const Announcement = require('../models/announcement');

exports.employeeUpdate = (req, res, next) => {
  const empId = req.user._id;
  const empFirstName = req.body.empFirstName;
  const empLastName = req.body.empLastName;
  const empEmail = req.body.empEmail;
  const empPassword = req.body.empPassword;
  // const empConfirmPass = req.body.empConfirmPass;
  const empContactNum = req.body.empContactNum;
  const gender = req.body.gender;
  Employee.findById(empId)
    .then(employee => {
      employee.empFirstName = empFirstName;
      employee.empLastName = empLastName;
      employee.empEmail = empEmail;
      employee.empPassword = empPassword;
      // employee.empConfirmPass = empConfirmPass;
      employee.empContactNum = empContactNum;
      employee.gender = gender;
      return employee.save();
    })
    .then(result => {
      // res.status(201).json({ message: result });
      res.status(201).send(result);

    })
    .catch(err => {
      res.status(500).json({ error: "failed to update" });
    });
};

exports.getMyTeam = (req, res, next) => {
  const empTeam = req.user.empTeam;
  const empPosition = req.user.empPosition;
  console.log(empTeam);
  console.log(empPosition);
  const teamMembers = [];
  Employee.find({ empTeam: empTeam })
  .then(employee => {
    for(i in employee){
      if(employee[i].empPosition == req.user.empPosition){
        teamMembers.push({
          empName: employee[i].empFirstName + " " + employee[i].empLastName,
          empPosition : employee[i].empPosition,
          empContactNum : employee[i].empContactNum,
          profilePicture : employee[i].profilePicture,
          empTeam : employee[i].empTeam,
          empEmail : employee[i].empEmail,
        });
      }
    }
    res.send(teamMembers);
  });
};


exports.getBuddy = (req, res, next) => {
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
                supervisor_id: result[i].supervisor[j].supervisor_id._id,
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


//displays all tasks that the person is responsible for 
exports.MyTasksSupervisor = (req, res, next) => {
  const currentPage = req.body.currentPage;
  const pageSize = req.body.pageSize;
  const skip = pageSize * (currentPage-1); 
  const limit = pageSize;
  // Employee.find({}).skip(skip).limit(limit).exec((err, docs) => {

  const supervisorId = req.user._id;
  const myTasks = [];
  console.log("supervisor id", supervisorId);
  generalTask.find({ personResponsible: supervisorId })
  .skip(skip).limit(limit)
  .exec((err, docs)=> {
    console.log(docs);
      for (i in docs) {
        myTasks.push({
          _id: docs[i]._id,
          // date: result[i].date,
          date: moment(docs[i].date).format("ddd MM DD YYYY"),
          type: docs[i].type,
          topic: docs[i].topic,
          objective: docs[i].objective,
          category: docs[i].category,
          estimatedTime: docs[i].estimatedTime,
        })
      }
      res.send(myTasks);
    });
}

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
            taskid: employeeTask.task[i].task_id,
            type: employeeTask.task[i].type,
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
            taskid: employeeTask.task[i].task_id,
            type: employeeTask.task[i].type,
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
        res.status(200).send(taskDetails);
      }
    })
    .catch(err => console.log(err));
};
// view task for suppervisor

exports.getTaskById = (req, res, next) => {
  const taskid = req.params.id;
  console.log("task id", taskid);
  generalTask.findById(taskid)
    // .populate('personResponsible','empFirstName')
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => {
      console.log(err);
    });
}
//view task for employee to check into ---employeetask for employees

exports.getTaskByIdEmp = (req, res, next) => {
  const taskid = req.params.id;
  console.log("task - id ", taskid);
  const taskDetails = [];
  console.log("user",req.user._id);
  employeeTask.find()
  .populate('task.personResponsible')
  .exec((err, result) => {
    if (err) {
      res.send(err);
    } else {
      for (i in result) {
console.log("result",result);
        if (result[i].user.toString() === req.user._id.toString()) {
          console.log("user in if....",result[i].user.toString())
          for (j in result[i].task) {
            if (result[i].task[j].task_id == taskid) {
                      taskDetails.push({
                        task_id: result[i].task[j].task_id,
                        type: result[i].task[j].type,
                        topic: result[i].task[j].topic,
                        objective: result[i].task[j].objective,
                        date: moment(result[i].task[j].date).format("DD-MM-YYYY"),
                        estimatedTime:result[i].task[j].estimatedTime,
                        personResponsible: result[i].task[j].personResponsible.empFirstName+ " " + result[i].task[j].personResponsible.empLastName,
                        sessionRating: result[i].task[j].sessionRating,
                        status: result[i].task[j].status,
                        sessionFeedbackComments: result[i].task[j].sessionFeedbackComments,
                        supervisorFeedbackComments: result[i].task[j].supervisorFeedbackComments
                      });
                    }
          }
        }
      }
      res.status(200).send(taskDetails);
    }
  });

};

exports.getSessionInfo = (req, res, next) =>{

  // console.log("request params", req.params.id);
  var sum=0;
  var avg=0;
  const taskId = req.params.id;
  const sessionInfo = [];
  var length = 1;
  employeeTask.find()
  .populate('user','empFirstName empLastName')
  .exec((err, result) => {
    if (err) {
      console.log(err);
    } else {
    for(i in result){
      for(j in result[i].task){
        if(result[i].task[j].task_id.toString() == taskId.toString()){   
          if(result[i].task[j].sessionFeedbackComments == null && result[i].task[j].sessionRating == null){
            break;
          }
          else{
          console.log("id is a match", result[i].task[j].task_id);  
          sum = sum + result[i].task[j].sessionRating;
          console.log("sum ", sum);
          sessionInfo.push({
            empName : result[i].user.empFirstName + " " + result[i].user.empLastName,
            sessionFeedbackComments : result[i].task[j].sessionFeedbackComments,
            sessionRating : result[i].task[j].sessionRating,
            ratingAvg : sum/length
          });
          length = sessionInfo.length+1;
        }
      }
      
      }
    }
  }
  res.send(sessionInfo);
  });
}

exports.countByStatus = (req, res, next) =>{

  const taskStatusCount = [];
  var pendingCount=0;
  var assignedCount=0;
  var completedCount=0;
  employeeTask.findOne({ user: req.user._id })
    .then((employeeTask) => {
      for(i in employeeTask.task){
        if(employeeTask.task[i].status == "pending" || employeeTask.task[i].status == "assigned"){
          pendingCount++;
        }
        else{
          if(employeeTask.task[i].status == "completed"){
            completedCount++;
          }
      }
      assignedCount++;
      }
      taskStatusCount.push({
        pending: pendingCount,
        assigned: assignedCount,
        completed: completedCount
      });
      res.send(taskStatusCount);
    })
}

exports.employeeCount = (req, res, next) =>{
  
}

//list of all tasks assigned to the employee ---for employee
exports.getEditTask = (req, res, next) => {
  const currentPage = req.body.currentPage;
  const pageSize = req.body.pageSize;
  const skip = pageSize * (currentPage-1); 
  const limit = pageSize;
  // Employee.find({}).skip(skip).limit(limit).exec((err, docs) => {
  employeeTask.findOne({ user: req.user._id })
  .skip(skip).limit(limit)
  .exec((err, employeeTask) => {
    // .then((employeeTask) => {
      const taskDetails = [];
      for (i in employeeTask.task) {
        taskDetails.push({
          task_id: employeeTask.task[i].task_id,
          type: employeeTask.task[i].type,
          topic: employeeTask.task[i].topic,
          category: employeeTask.task[i].category,
          objective: employeeTask.task[i].objective,
          date: moment(employeeTask.task[i].date).format("DD-MM-YYYY"),
          estimatedTime: employeeTask.task[i].estimatedTime,
          sessionRating: employeeTask.task[i].sessionRating,
          status: employeeTask.task[i].status,
          sessionFeedbackComments: employeeTask.task[i].sessionFeedbackComments
        });
      }
      // res.json({ message: taskDetails });
      res.status(200).send(taskDetails);
    });
    // .catch(err => console.log(err));
};

// exports.clearAnnouncement = (req, res, next) => {
//   Announcement.find({user:req.user._id})
//   .then((err, result) => {
//     if (err) {
//       res.send(err);
//     }
//     else {
//       for (i in result.announcement) {
//         if (result.announcement[i].announcement_id == req.body.announcementId) {
//           result.announcement.pull({ _id: result.announcement[i]._id });
//         }
//       }
//       result.save();
//       res.send(result);
//     }
//   });
// }

exports.fetchAnnouncement = (req, res, next) =>{
  // var date = moment().format("DD-MM-YYYY");
  var date = new Date().toLocaleDateString();
  // const taskDate1 = moment(employeeTask.task[i].date).format("YYYY-MM-DD");
        // var stringDate = taskDate1.split('-');
        // const taskMonth = Number(stringDate[1]);
        // const newdate = employeeTask.task[i].date.toLocaleDateString();
        // if (newdate == date && taskMonth == new Date().getMonth() + 1) {

  const announcement = [];
  Announcement.find({})
  .exec((err, result) => {
    if(err){
      res.send(err)
    }else{
      for(i in result){
        const announcementDate = moment(result[i].date).format("DD-MM-YYYY");
        // const announcementDate = moment(result[i].date).format("DD-MM-YYYY");

        var stringDate = announcementDate.split('-');
        const taskMonth = Number(stringDate[1]);
        const newdate = result[i].date.toLocaleDateString();
        console.log("new date",newdate);
        console.log("announcementDate", announcementDate);
        console.log("Date", date);
        // if(compare(announcementDate, date) == 1){
          // if(announcementDate === date) {
            if (newdate == date && taskMonth == new Date().getMonth() + 1) {
          console.log(date, announcementDate);
          announcement.push({
            description: result[i].description
          })
        }
      }
      res.send(announcement);
    }
  });
}

exports.submitLike = (req, res, next) => {
  console.log("in blogs")
  Blog.findById({_id:req.params.id})
  .then(result => {
      result.likes = result.likes + 1;
      result.save();   
    res.send(result);
  })
  .catch(err=>res.send(err));
}

//for person responsible eg- hr or supervisor
exports.getEditTaskForUser = (req, res, next) => {
  employeeTask.findOne({ personResponsible: req.user._id, user: req.body.user_id })
    .then((employeeTask) => {
      const taskDetails = [];
      for (i in employeeTask.task){
        taskDetails.push({
          task_id: employeeTask.task[i].task_id,
          type: employeeTask.task[i].type,
          topic: employeeTask.task[i].topic,
          objective: employeeTask.task[i].objective,
          date: moment(employeeTask.task[i].date).format("DD-MM-YYYY"),
          estimatedTime: employeeTask.task[i].estimatedTime,
          feedbackComments: employeeTask.task[i].feedbackComments,
          status: employeeTask.task[i].status,
          summaryComments: employeeTask.task[i].summaryComments
        });
      }
      // res.json({message: taskDetails});
      res.status(200).send(taskDetails);
    })
    .catch(err => console.log(err));
};

//for person responsible eg- hr or supervisor
exports.postEditTaskForUser = (req, res, next) => {
  employeeTask.findOne({ 'personResponsible': req.session.user._id, 'user': req.body.user_id })
    .then((employeeTask) => {
      for (i in employeeTask.task) {
        if (employeeTask.task[i].task_id == req.body.task_id && employeeTask.task[i].type == "session") {
          employeeTask.task[i].supervisorFeedbackComments = req.body.supervisorFeedbackComments;
          // employeeTask.task[i].objective = req.body.objective;
          // employeeTask.task[i].estimatedTime = req.body.estimatedTime;
        }
        else {
          res.status(403).send("cant process the request");
        }
      }
      employeeTask.save();
      res.status(200).send(employeeTask);
    })
    .catch(err => console.log(err));
};

// for supervisor to give feedback
exports.supervisorFeedback = (req, res, next) => {

  employeeTask.findOne({'user': req.body.user_id })
    .then((employeeTask) => {
      for (i in employeeTask.task) {
        console.log("task id ",req.body.task_id);
        if (employeeTask.task[i].task_id.toString() == req.body.task_id.toString()) {
          console.log("loop task id",employeeTask.task[i].task_id);
          employeeTask.task[i].supervisorFeedbackComments = req.body.supervisorFeedbackComments;
          employeeTask.save();
          break;
        }
      }
      // employeeTask.save();
      res.status(200).send(employeeTask);
    })
    .catch(err => console.log(err));
};

//for employee
exports.postEditTask = (req, res, next) => {
  employeeTask.findOne({ user: req.user._id })
    .then((employeeTask) => {
      for (i in employeeTask.task) {
        if (employeeTask.task[i].task_id == req.body.task_id) {
          if (employeeTask.task[i].type == "session") {
            employeeTask.task[i].sessionRating = req.body.sessionRating;
            employeeTask.task[i].status = req.body.status;
            employeeTask.task[i].sessionFeedbackComments = req.body.sessionFeedbackComments;
            employeeTask.save();
            break;
          } else {
            employeeTask.task[i].status = req.body.status;
            employeeTask.save();
            break;
          }
        }
      }
      res.status(200).send(employeeTask);
    })
    .catch(err => console.log(err));
};

//supervisor edits one task for all employees
exports.editAllTaskSup = (req, res, next) => {
  const taskId = req.body.taskId;
  const date = req.body.date;
  const nowDate = new Date(date);
  console.log("nowdate", nowDate);
  employeeTask.find()
    .then((employeeTask) => {
      for (i in employeeTask) {
        for (j in employeeTask[i].task) {
          if (employeeTask[i].task[j].task_id.toString() == taskId.toString()) {
            employeeTask[i].task[j].date = nowDate;
            console.log("date from db", employeeTask[i].task[j].date);
            console.log("now date ", nowDate);
            employeeTask[i].save();
          }
        }
      }
      res.status(200).send(employeeTask);
    })
    .catch(err => console.log(err));
}

//assigned employees for supervisor
exports.getSupTeam = (req, res, next) => {
  const currentPage = req.body.currentPage;
  const pageSize = req.body.pageSize;
  const skip = pageSize * (currentPage-1); 
  const limit = pageSize;
  // Employee.find({}).skip(skip).limit(limit).exec((err, docs) => {

  console.log("supervisor id ", req.user._id);
  const team = [];  
    employeeTask.find()
      .populate('user','empFirstName empLastName empEmail empPosition')
      .skip(skip).limit(limit)
      .exec((err, result) => {
        if (err) {
          console.log(err);
        } else {
          for (i in result) {
              for (j in result[i].task) {
                if (result[i].task[j].personResponsible.toString() === req.user._id.toString()) {
                      team.push(
                       result[i].user
                    );  
                    break; 
                }
              }
            }
          }       
          res.status(200).send(team);
      });
}

exports.getTaskBySupervisor = (req, res, next) => {

  employeeTask.find()
    .then((err, result) => {
      if (err) {
        console.log(err);
      } else {
        for(i in result){
          for(j in result[i].task){
            console.log();
          }
        }
        console.log(employeeTask.task.personResponsible);
        res.send(employeeTask);
      }
    });
};

exports.myBuddies = (req, res, next) => {
  console.log("supervisorid ", req.user._id);
  var emp_id;
  
  Buddy.find()
  .then((result) => {
     for(i in result){
       for(j in result[i].buddy){
          if(result[i].buddy[j].buddy_id.toString() === req.user._id.toString()){
              console.log(" in if loop ", result[i].employee );
              emp_id =  result[i].employee;
         }
      }
      }
      res.send(emp_id);
    
  });
}

exports.viewEmployee = (req, res, next) => {
  const empId = req.params.id;
  console.log(empId);
  Employee.findById(empId)
    .then(employees => {
      if (!employees) {
        return res.send("no result found");
      }
      console.log(employees);
      res.send(employees);
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
        console.log(employeeTask.task.personResponsible.empFirstName);
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
            taskid: employeeTask.task[i].task_id,
            type: employeeTask.task[i].type,
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