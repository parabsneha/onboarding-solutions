const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');

const hrSchema = new mongoose.Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    email:{
        type: String,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password:{
        type: String
    },
    confirmPass:{
        type: String
    },
    contactNum:{
        type: Number
    }, 
    gender:{
        type:String
    },   
    taskList: {
        tasks:[
            {
                taskid : { 
                        type: mongoose.Schema.Types.ObjectId, 
                        ref: 'Task' ,
                        required: true
                        },
                user  : [{
                        type:mongoose.Schema.Types.ObjectId, 
                        ref: 'Employee' 
                        }]
            }
        ]
    }
},
{
    timestamps: true,
});

hrSchema.pre("save", async function(next) {
    if (this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmPass = undefined;
    }
    next();
});

hrSchema.methods.addToTasksList = function(task,user_id){
    const taskIndex = this.taskList.tasks.findIndex(at =>{  //checking if the task already exists
        return at.taskid.toString() === task._id.toString();
    });
    const updatedTasks = [...this.taskList.tasks]; //new array with all the tasks stored in taskList field
    if(taskIndex < 0){ //doesnt exist, so create new     
        updatedTasks.push({
            taskid: task._id, 
            user: user_id
        });
        console.log('updated task ',updatedTasks );
        const updatedTaskList = {
            tasks: updatedTasks
        };
        this.taskList = updatedTaskList;
        console.log("task saved in hr");
        return this.save();
    }
    else{
        return 0; //task exist - do nothing
    }
}

const Hr = mongoose.model('Hr', hrSchema);

module.exports = Hr;