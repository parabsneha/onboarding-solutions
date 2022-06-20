const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    profilePicture: {
        type: String,
    },
    empFirstName: {
        type: String,
    },
    empLastName: {
        type: String,
    },
    empEmail: {
        type: String,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    empPassword: {
        type: String,
    },
    empConfirmPass: {
        type: String,
    },
    empContactNum: {
        type: Number,
    },
    empPosition: {
        type: String,
    },
    empTeam: {
        type: String,
    },
    gender: {
        type: String,
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Employee'
    },
    role:{
        type:String,
        default:'employee',
        enum:['employee', 'admin']
    }

    // assignedTaskList: {
    //     tasks: [
    //         {
    //             onModel: {
    //                 type: String,
    //             },
    //             taskid: {
    //                 type: mongoose.Schema.Types.ObjectId,
    //                 ref: 'Task',
    //             },
    //             status: {
    //                 type: String,
    //                 required: true
    //             }
    //         }
    //     ]
    // },
},
    {
        timestamps: true,
    });

employeeSchema.pre("save", async function (next) {
    if (this.isModified('empPassword')) {
        this.empPassword = await bcrypt.hash(this.empPassword, 10);
        this.empConfirmPass = undefined;
    }
    next();
});

// employeeSchema.methods.editTaskStatus = function (_id, updatedStatus) {
//     console.log(this.assignedTaskList.tasks);
//     const taskIndex = this.assignedTaskList.tasks.findIndex(at => {  //checking if the task already exists
//         return at._id.toString() === _id.toString();
//     });
//     console.log(taskIndex);
//     console.log(updatedStatus);
//     if (taskIndex >= 0) {
//         // console.log("before => ",this.assignedTaskList.tasks[taskIndex].status);
//         this.assignedTaskList.tasks[taskIndex].status = updatedStatus;
//         return this.save();
//     }
//     else {
//         console.log("task doesnt exist");
//     }
// }


employeeSchema.methods.addToTasksList = function (task, onmodel) {
    console.log(task);
    const assignedTaskIndex = this.assignedTaskList.tasks.findIndex(at => {  //checking if the task already exists
        return at.taskid.toString() === task._id.toString();
    });
    const defaultStatus = "assigned";
    const updatedAssignedTasks = [...this.assignedTaskList.tasks]; //new array with all the tasks stored in assignedTaskList field
    if (assignedTaskIndex < 0) { //doesnt exist, so create new     
        updatedAssignedTasks.push({
            onModel: onmodel,
            taskid: task._id,
            status: defaultStatus
        });
        const updatedAssignedTaskList = {
            tasks: updatedAssignedTasks
        };
        this.assignedTaskList = updatedAssignedTaskList;
        return this.save();
    }
    else {
        return 0; //task exist - do nothing
    }
}

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;