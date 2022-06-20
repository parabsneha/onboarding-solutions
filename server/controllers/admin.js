const { json } = require('express/lib/response');
const { use } = require('../app');
const moment = require('moment');
require('../DB/Connection');
const Employee = require('../models/employee');
const Mentor = require('../models/mentor');
const Buddy = require('../models/buddy');
const Supervisor = require('../models/supervisor');
const generalTask = require('../models/generalTask');
const employeeTask = require('../models/employeeTask');
const Hr = require('../models/Hr');
const passport = require('passport');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "par007@chowgules.ac.in",
    pass: "su170277",
  }
});

exports.AddEmployee = (req, res, next,) => {
  let profilePicture = req.body.profilePicture;
  // console.log("req ", req);
  console.log("pic url from server ", profilePicture);

  const { empFirstName, empLastName, empEmail, empPassword, empConfirmPass, empContactNum, empPosition, empTeam, gender, role } = req.body;
  Employee.findOne({ empEmail: empEmail })
    .then((userExist) => {
      if (userExist) {
        return res.status(422).json({ error: 'Email already exists' });
      }
      const employee = new Employee({ empFirstName, empLastName, empEmail, empPassword, profilePicture, empConfirmPass, empContactNum, empPosition, empTeam, gender, role });
      employee.save()
        .then((employee) => {
          const employeetask = new employeeTask({ user: employee._id });
          employeetask.save()
            .then(() => {
              generalTask.find()
                .then((gentask) => {
                  for (index in gentask) {
                    console.log("adding to task list", gentask[index]);
                    employeetask.addToTasksList(gentask[index]);
                  }
                  employeetask.save();
                  console.log("employeetask", employeetask);
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
          var mailOptions = {
            from: 'par007@chowgules.ac.in',
            to: employee.empEmail,
            subject: 'Sign up success!',
            text: "Hi " + employee.empFirstName + " you have been successfully registered. Below are your credentials to log in to our system. " +
              "username: "
              + employee.empEmail +
              " password: " + empPassword + " "
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              // console.log('email sent:' + info.response);
            }
          });
        })
        .then(() => {
          Employee.find({ empTeam: empTeam })
            .then((employee) => {
              for (emp in employee) {
                if (employee[emp].empEmail == empEmail) {
                  return;
                }
                console.log(employee[emp].empEmail);
                var mailOptions2 = {
                  from: 'par007@chowgules.ac.in',
                  to: employee[emp].empEmail,
                  subject: 'Welcoming ' + empFirstName + ' ' + empLastName + ' to our team',
                  text: "Hello team, I am pleased to introduce " + empFirstName + " " + empLastName + " , who is joining us as a " + empPosition
                };
                transporter.sendMail(mailOptions2, function (error, info) {
                  if (error) {
                    console.log(error);
                  } else {
                    // console.log('email sent:' + info.response);
                  }
                });
              }
            })
            .catch(err => res.send(err.message))
          res.status(201).json({ message: "user successfully registered" });
        })
        .catch(err => res.send(err.message));
    }).catch((err) => { console.log(err) });

};

exports.deleteTask = (req, res, next) => {
  const taskId = req.params.id;
  generalTask.findByIdAndRemove(taskId, function (err, docs) {
    console.log("docs  ", docs);
    if (err) {
      console.log(err)
      res.send("error");
    }
    else {
      console.log("Deleted : ", docs);
      res.send(docs);
    }
  });
}

exports.DeleteEmployee = (req, res, next) => {
  // const empId = req.body._id;
  const empId = req.params.id;
  console.log(empId);
  Employee.findByIdAndRemove(empId, function (err, docs) {
    console.log("docs  ", docs);
    if (err) {
      console.log(err)
      res.send("error");
    }
    else {
      console.log("Deleted : ", docs);
      res.send(docs);
    }
  });
}

exports.getAllTasks = (req, res, next) => {
  const taskDetails = [];
  generalTask.find()
    .then(result => {
      if (!result) {
        return res.status(204).send("nothing to fetch");
      }
      for (i in result) {
        taskDetails.push({
          _id: result[i]._id,
          date: moment(result[i].date).format("DD-MM-YYYY"),
          type: result[i].type,
          topic: result[i].topic,
          objective: result[i].objective,
          category: result[i].category,
          personResponsible: result[i].personResponsible,
          estimatedTime: result[i].estimatedTime
        });
      }
      console.log(taskDetails);
      res.send(taskDetails);
    })
    .catch(err => res.status(500).send(err));
};

// exports.getAllTasks = (req, res, next) => {
//   generalTask.find()
//   .then(result => {
//     if (!result) {
//       return res.status(204).send("nothing to fetch");
//     }
//     console.log(result);
//     res.send(result);
//   })
//   .catch(err => res.status(500).send(err));
// };

exports.getAllEmployee = (req, res, next) => {
  Employee.find((err, docs) => {
    if (!err) {
      res.send(docs);
    } else {
      console.log('Failed to retrieve the employee List: ' + err);
    }
  });
};
//get hr for person responsible dropdown
exports.getEmployee = (req, res, next) => {
  // const position = "Hr";
  console.log("function", req.params.category);
  const position = req.params.category;
  const names = [];
  Employee.find({ empPosition: position }, (err, docs) => {
    if (!err) {
      for (i in docs) {
        const name = docs[i].empFirstName + " " + docs[i].empLastName;
        names.push(name);
      }
      res.send(names);
    } else {
      console.log('Failed to retrieve the employee List: ' + err);
      res.status(401).send(err);
    }
  });
};

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

exports.updateEmployee = (req, res, next) => {
  console.log("request");
  const empId = req.body._id;
  const empPosition = req.body.empPosition;
  const empTeam = req.body.empTeam;
  console.log("details ");
  console.log(empId, empPosition, empTeam);
  Employee.findById(empId)
    .then(employee => {
      console.log(employee);
      console.log(empPosition, empTeam);
      employee.empPosition = empPosition;
      employee.empTeam = empTeam;
      return employee.save();
    })
    .then(result => {
      res.status(201).send(result);
    })
    .catch(err => {
      res.status(500).json({ error: "failed to update" });
    });
};
//populate doesnt work
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
};

exports.getEmployeeById = (req, res, next) => {
  const empid = req.params.id;
  // console.log(empid);
  Employee.findById(empid)
    .then(employee => {
      console.log(employee);
      res.send(employee);
    })
    .catch(err => {
      console.log(err);
    });
};

exports.assignSupervisor = (req, res, next) => {
  Supervisor.findOne({ employee: req.body.empId })
    .then(result => {
      if (result) {
        result.addToSupervisorList(req.body.supervisorId);
        return res.send(result);
      }
      else {
        const supervisor = new Supervisor({ employee: req.body.empId });
        console.log(supervisor);
        supervisor.save()
          .then((result) => {
            console.log("result", result);
            result.addToSupervisorList(req.body.supervisorId);
            return res.send(result);
          })
          .catch(err => res.send(err));
      }
    }).catch(err => console.log(err));

};

exports.assignBuddy = (req, res, next) => {
  Buddy.findOne({ employee: req.body.empId })
    .then(result => {
      if (result) {
        result.addBuddyToList(req.body.buddyId);
        return res.send(result);
      }
      else {
        const buddy = new Buddy({ employee: req.body.empId });
        buddy.save()
          .then((result) => {
            result.addBuddyToList(req.body.buddyId);
            return res.send(result);
          })
          .catch(err => res.send(err));
      }
    }).catch(err => console.log(err));
}


exports.assignMentor = (req, res, next) => {
  Mentor.findOne({ employee: req.body.empId })
    .then(result => {
      if (result) {
        result.addToMentorList(req.body.mentorId);
        return res.send(result);
      }
      else {
        const mentor = new Mentor({ employee: req.body.empId });
        mentor.save()
          .then((result) => {
            result.addToMentorList(req.body.mentorId);
            return res.send(result);
          })
          .catch(err => res.send(err));
      }
    }).catch(err => console.log(err));

};

exports.deleteBuddy = (req, res, next) => {
  Buddy.findOne({ employee: req.body.empId }, (err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      for (i in result.buddy) {
        if (result.buddy[i].buddy_id == req.body.buddyId) {
          result.buddy.pull({ _id: result.buddy[i]._id });
        }
      }
      result.save();
      res.send(result);
    }
  });
};

exports.deleteSupervisor = (req, res, next) => {
  Supervisor.findOne({ employee: req.body.empId }, (err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      for (i in result.supervisor) {
        if (result.supervisor[i].supervisor_id == req.body.supervisorId) {
          result.supervisor.pull({ _id: result.supervisor[i]._id });
        }
      }
      result.save();
      res.send(result);
    }
  });
};

exports.deleteMentor = (req, res, next) => {
  Mentor.findOne({ employee: req.body.empId }, (err, result) => {
    if (err) {
      res.send(err);
    }
    else {
      for (i in result.mentor) {
        if (result.mentor[i].mentor_id == req.body.mentorId) {
          result.mentor.pull({ _id: result.mentor[i]._id });
        }
      }
      result.save();
      res.send(result);
    }
  });
};

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------

// exports.postAddHr = (req, res, next) => {

//   const { firstName, lastName, email, password, confirmPass, contactNum, gender } = req.body;
//   Hr.findOne({ email: email })
//     .then((userExist) => {
//       console.log('inside then');
//       if (userExist) {
//         return res.status(422).json({ error: 'Email already exists' });
//       }
//       const hr = new Hr({ firstName, lastName, email, password, confirmPass, contactNum, gender });
//       console.log(hr);
//       hr.save()
//         .then((hr) => {
//           var mailOptions = {
//             from: 'par007@chowgules.ac.in',
//             to: hr.email,
//             subject: 'Sign up success!',
//             text: "Hi " + hr.firstName + " you have been successfully registered. Below are your credentials to log in to our system. " +
//               "username: "
//               + hr.email +
//               " password: " + password + " "
//           };
//           transporter.sendMail(mailOptions, function (error, info) {
//             if (error) {
//               console.log(error);
//             } else {
//               console.log('email sent:' + info.response);
//             }
//           });
//           res.status(201).json({ message: "user successfully registered" });
//         })
//         .catch(err => res.send(err.message));
//     }).catch((err) => { console.log(err) });

// };

exports.updateTask = (req, res, next) => {
  const id = req.params.id;
  const date = new Date();
  const type = req.body.type;
  const topic = req.body.topic;
  const objective = req.body.objective;
  const category = req.body.category;
  const personResponsible = req.body.personResponsible;
  const estimatedTime = req.body.estimatedTime;
  generalTask.findById(id)
    .then((result) => {
      if (result._id == id) {
        result.type = type;
        result.topic = topic;
        result.objective = objective;
        result.category = category;
        result.personResponsible = personResponsible;
        result.estimatedTime = estimatedTime;
      } else {
        res.status(403).send("cant process the request");
      }
      result.save();
      res.status(200).send(result);
    }).catch(err => console.log(err));

};

// ------------------create general task -----------------------------

// exports.addGenTask = (req, res, next) => {
//   const taskDetails=[];
//   // const date = new Date();
//   const date = new Date();
//   const type = req.body.type;
//   const topic = req.body.topic;
//   const objective = req.body.objective;
//   const category = req.body.category;
//   const personResponsible = req.body.personResponsible;
//   const estimatedTime = req.body.estimatedTime;
//   const genTask = new generalTask({ date, type, topic, objective, category, personResponsible, estimatedTime});
//   genTask.save()
//     .then((genTask) => {
//       for(i in genTask){
//         taskDetails.push({
//           _id:  genTask[i]._id,
//           date: moment(genTask[i].date).format("DD-MM-YYYY"),
//           type:  genTask[i].type,
//           topic:  genTask[i].topic,
//           objective:  genTask[i].objective,
//           category:  genTask[i].category,
//           personResponsible:  genTask[i].personResponsible,
//           estimatedTime:genTask[i].estimatedTime
//         });
//       }
//       res.send(taskDetails);
//     })
//     .catch(err => console.log(err));
// };


exports.addGenTask = (req, res, next) => {

  // const date = new Date();
  const date = new Date();
  const type = req.body.type;
  const topic = req.body.topic;
  const objective = req.body.objective;
  const category = req.body.category;
  const personResponsible = req.body.personResponsible;
  const estimatedTime = req.body.estimatedTime;
  const genTask = new generalTask({ date, type, topic, objective, category, personResponsible, estimatedTime });
  genTask.save()
    .then((genTask) => {
      res.send(genTask);
    })
    .catch(err => console.log(err));
};

// exports.getUserByTask = (req, res, next) => {
//   const _id = req.body._id;
//   generalTask.findById({ _id: _id })
//     .populate('assignedBy')
//     // .exec(function (generalTask) {
//     .then((result) => {
//       res.send(result.assignedBy.firstName + result.assignedBy.lastName);

//     }).catch(err => console.log(err));
// };

// exports.getempByTask = (req, res, next) => {
//   const _id = req.body._id;
//   generalTask.findById({ _id: _id })
//     .populate('assignedBy', 'empFirstName')
//     // .exec(function (generalTask) {
//     .then((result) => {
//       res.send(result.assignedBy.empFirstName);

//     }).catch(err => console.log(err));
// };

// -------------------------------

// module.exports ={
//   userAuth
// }