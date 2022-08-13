const { json } = require('express/lib/response');
const { use } = require('../app');
const moment = require('moment');
require('../DB/Connection');
const Employee = require('../models/employee');
const Mentor = require('../models/mentor');
const Buddy = require('../models/buddy');
const Blog = require('../models/blog');
const Announcement = require('../models/announcement');
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
  console.log("add employee function ", req.body);
  let profilePicture = req.body.profilePicture;
  const roles = ["admin"];
  const positions = ["supervisor", "Hr"];

  const { empFirstName, empLastName, empEmail, empPassword, empConfirmPass, empContactNum, empPosition, empTeam, gender, role } = req.body;
  Employee.findOne({ empEmail: empEmail })
    .then((userExist) => {
      if (userExist) {
        return res.status(422).json({ error: 'Email already exists' });
      }
      const employee = new Employee({ empFirstName, empLastName, empEmail, empPassword, profilePicture, empConfirmPass, empContactNum, empPosition, empTeam, gender, role });
      employee.save()
        .then((employee) => {
          if (!positions.includes(req.body.empPosition) && !roles.includes(req.body.role)) { //if user aint a supervisor or hr then assign them general onboarding tasks
            console.log("saved data ", employee);
            const employeetask = new employeeTask({ user: employee._id });
            employeetask.save()
              .then(() => {
                generalTask.find()
                  .then((gentask) => {
                    for (index in gentask) {
                      employeetask.addToTasksList(gentask[index]);
                    }
                    employeetask.save();
                  }).catch(err => console.log(err));
              }).catch(err => console.log(err));
          }
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
          Employee.find({ empTeam: empTeam }, { empPosition: empPosition })
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
  const empId = req.params.id;
  console.log(empId);
  Employee.findByIdAndRemove(empId, function (err, docs) {
    console.log("docs  ", docs);
    if (err) {
      console.log(err)
      res.send("error");
    }
    else {
      employeeTask.findOneAndRemove({user:empId}, function (err, docs) {
        console.log("docs  ", docs);
        if (err) {
          console.log(err)
          res.send("error");
        }else{
          console.log("Deleted from employee task : ", docs);
          
        }
      });
      console.log("Deleted : ", docs);
      res.send(docs);
    }
  });
}

exports.getSupervisorList = (req, res, next) => {
  console.log("in get supervisor list function");
  const empId = req.params.id;
  const supervisorsList = [];
  Employee.find((err, docs) => {
    if (err) {
      console.log("if error then here");
      res.send(docs);
    } else {
      console.log("in else part");
      for (i in docs) {
        console.log("the list", docs);
        if (docs[i].role != "admin" && docs[i]._id != empId) {
          supervisorsList.push({
            supervisorName: docs[i].empFirstName + " " + docs[i].empLastName,
            supervisorId: docs[i]._id
          })
        }
      }
      res.status(200).send(supervisorsList);
    }
  });

}

exports.getEmployeeSupervisor = (req, res, next) => {
  const empId = req.params.id;
  const supervisors = [];
  Supervisor.find()
    .populate('supervisor.supervisor_id')
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        for (i in result) {
          if (result[i].employee.toString() === empId.toString()) {
            for (j in result[i].supervisor) {
              supervisors.push({
                supervisor: result[i].supervisor[j].supervisor_id.empFirstName + " " + result[i].supervisor[j].supervisor_id.empLastName,
                supervisor_id: result[i].supervisor[j].supervisor_id._id,
                date: moment(result[i].supervisor[j].date).format("DD-MM-YYYY")
              })
            }
          }
        }
        res.status(200).send(supervisors);
      }
    });
};

exports.makeAnnouncement = (req, res, next) => {
  description = req.body.description;
  const announcement = new Announcement({ description });
  announcement.save()
    .then((result) => {
      console.log("result", result);
      return res.send(result);
    })
    .catch(err => { });
}

exports.fetchAnnouncement = (req, res, next) => {
  const currentPage = req.body.currentPage;
  const pageSize = req.body.pageSize;
  const skip = pageSize * (currentPage - 1);
  const limit = pageSize;
  const announcement = [];
  Announcement.find({})
    .skip(skip).limit(limit)
    .exec((err, result) => {
      if (err) {
        res.send(err)
      } else {
        for (i in result) {
          announcement.push({
            _id: result[i]._id,
            description: result[i].description,
            date: moment(result[i].date).format("MMMM-Do-YYYY")
          });
        }
        res.send(announcement);
      }
    });
}

exports.createBlog = (req, res, next) => {
  description = req.body.description;
  content = req.body.content;
  likes = 0;
  const blog = new Blog({ description, content, likes });
  blog.save()
    .then((result) => {
      console.log("result", result);
      return res.send(result);
    })
    .catch(err => { });
}

exports.fetchBlog = (req, res, next) => {
  const currentPage = req.body.currentPage;
  const pageSize = req.body.pageSize;
  const skip = pageSize * (currentPage - 1);
  const limit = pageSize;
  const blog = [];

  Blog.find({})
    .skip(skip).limit(limit)
    .exec((err, result) => {
      if (err) {
        res.send(err)
      } else {
        for (i in result) {
          blog.push({
            _id: result[i]._id,
            description: result[i].description,
            content: result[i].content,
            likes: result[i].likes,
            postedAt: moment(result[i].updatedAt).format("MMMM-Do-YYYY")
          });
        }
      }
      res.send(blog);
    });
}

exports.getEmployeeBuddy = (req, res, next) => {
  const empId = req.params.id;
  const buddies = [];
  Buddy.find()
    .populate('buddy.buddy_id')
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        for (i in result) {
          if (result[i].employee.toString() === empId.toString()) {
            for (j in result[i].buddy) {
              buddies.push({
                buddy: result[i].buddy[j].buddy_id.empFirstName + " " + result[i].buddy[j].buddy_id.empLastName,
                buddy_id: result[i].buddy[j].buddy_id._id,
                date: moment(result[i].buddy[j].date).format("DD-MM-YYYY")
              })
            }
          }
        }
        res.status(200).send(buddies);
      }
    });
};

exports.getEmployeeMentor = (req, res, next) => {
  const empId = req.params.id;
  const mentors = [];
  Mentor.find()
    .populate('mentor.mentor_id')
    .exec((err, result) => {
      if (err) {
        res.send(err);
      } else {
        for (i in result) {
          if (result[i].employee.toString() === empId.toString()) {
            for (j in result[i].mentor) {
              mentors.push({
              
                mentor: result[i].mentor[j].mentor_id.empFirstName + " " + result[i].mentor[j].mentor_id.empLastName,
                mentor_id: result[i].mentor[j].mentor_id._id,
                date: moment(result[i].mentor[j].date).format("DD-MM-YYYY")
              })
            }
          }
        }
        console.log(mentors);
        res.status(200).send(mentors);
      }
    });
}

exports.noOfEmployees = (req, res, next) => {
  const count = [];
  Employee.countDocuments({ role: 'employee' }, function (err, c) {
    console.log('Count is ' + c);
    count.push(c);
    res.send(count);
  });
}

exports.noOfTasks = (req, res, next) => {
  var count;
  generalTask.countDocuments(function (err, c) {
    console.log('Count is ' + c);
    count = c;
    res.send(count);
  });
}

exports.getAllTasks = (req, res, next) => {
  const currentPage = req.body.currentPage;
  const pageSize = req.body.pageSize;
  const skip = pageSize * (currentPage - 1);
  const limit = pageSize;
  const taskDetails = [];
  generalTask.find()
    .skip(skip).limit(limit)
    .populate('personResponsible')
    .exec((err, result) => {
      if (err) {
        return res.status(204).send("nothing to fetch");
      }
      console.log("result ", result);
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
    });
  // .catch(err => res.status(500).send(err));
}

exports.getPersonResponsible = (req, res, next) => {
  const positions = ["supervisor", "Hr"];
  const employeeList = [];
  Employee.find((err, result) => {
    if (err) {
      console.log("if error then here");
      res.send(result);
    }
    console.log("results", result);
    for (i in result) {
      if (positions.includes(result[i].empPosition)) {
        employeeList.push({
          employeeName: result[i].empFirstName + " " + result[i].empLastName,
          employeeId: result[i]._id
        });
      }
    }
    console.log(employeeList);
    res.send(employeeList);
  });
  // .catch(err => res.status(500).send(err));
}



exports.getAllEmployee = (req, res, next) => {

  const currentPage = req.body.currentPage;
  const pageSize = req.body.pageSize;
  const skip = pageSize * (currentPage - 1);
  const limit = pageSize;
  const employee = [];
  Employee.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (!err) {
      for(i in docs){
      employee.push({
        _id:docs[i]._id,
      empFirstName: docs[i].empFirstName,
      empLastName:docs[i].empLastName,
      empTeam:docs[i].empTeam,
      empEmail:docs[i].empEmail,
      empPosition:docs[i].empPosition,
      empContactNum:docs[i].empContactNum,
      gender:docs[i].gender,
      role:docs[i].role,
      profilePicture:docs[i].profilePicture,

      });
    }
      res.send(employee);
    } else {
      console.log('Failed to retrieve the employee List: ' + err);
      res.send(err);
    }
  });

  // const currentPage = req.body.currentPage;
  // const pageSize = req.body.pageSize;
  // const skip = pageSize * (currentPage - 1);
  // const limit = pageSize;
  // Employee.find({}).skip(skip).limit(limit).exec((err, docs) => {
  //   if (!err) {
  //     res.send(docs);
  //   } else {
  //     console.log('Failed to retrieve the employee List: ' + err);
  //     res.send(err);
  //   }
  // });

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

// exports.getTaskById = (req, res, next) => {

//   const taskDetails = [];
//   const taskid = req.params.id;
//     console.log("task id", taskid);
//     generalTask.findById(taskid)
//     .populate('personResponsible')
//     .exec((err, result) => {
//       if (err) {
//         return res.status(204).send("nothing to fetch");
//       }
//       // console.log(taskDetails);
//       res.send(result);
//     });
// };


// exports.getTaskById = (req, res, next) => {
//   const taskid = req.params.id;
//   console.log("task id", taskid);
//   generalTask.findById(taskid)
//     // .populate('personResponsible','empFirstName')
//     .then(result => {
//       console.log(result);
//       res.send(result);
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };


exports.getEmployeeById = (req, res, next) => {
  const empid = req.params.id;
  console.log(empid);
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
  console.log(req.body.supervisorId);
  if (req.body.supervisorId != null) {
    Supervisor.findOne({ employee: req.body.empId })
      .then(result => {
        if (result) {
          result.addToSupervisorList(req.body.supervisorId);
          return res.send(result);
        }
        else {
          const supervisor = new Supervisor({ employee: req.body.empId });
          supervisor.save()
            .then((result) => {
              result.addToSupervisorList(req.body.supervisorId);
              return res.send(result);
            })
            .catch(err => { });
        }
      }).catch(err => { });
  }
  else {
    console.log("supervisor undefined");
  }

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


exports.updateTask = (req, res, next) => {
  const id = req.params.id;
  // const date = new Date();
  const date = req.body.date;
  const type = req.body.type;
  const topic = req.body.topic;
  const objective = req.body.objective;
  const category = req.body.category;
  // const personResponsible = req.body.personResponsible;
  // console.log("personResponsible",personResponsible);
  const estimatedTime = req.body.estimatedTime;
  generalTask.findById(id)
    .then((result) => {
      if (result._id == id) {
        result.type = type;
        // result.date = date;
        result.topic = topic;
        result.objective = objective;
        result.category = category;
        // result.personResponsible = personResponsible;
        result.estimatedTime = estimatedTime;
      } else {
        return res.status(403).send("cant process the request");
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

  const date = req.body.date;
  // const date = new Date();
  console.log("date",date);
  const type = req.body.type;
  const topic = req.body.topic;
  const objective = req.body.objective;
  const category = req.body.category;
  const personResponsible = (req.body.personResponsible) ? req.body.personResponsible : " ";
  const estimatedTime = req.body.estimatedTime;
  const genTask = new generalTask({ date, type, topic, objective, category, personResponsible, estimatedTime });
  genTask.save()
    .then((genTask) => {
      res.send(genTask);
    })
    .catch(err => console.log(err));
};

