const mongoose = require('mongoose');

const supervisorSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Employee'
    },
    supervisor: [{
        supervisor_id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Employee'
        },
        date: {
            type: Date,
		    default: Date.now
        }
    }]
});


supervisorSchema.methods.addToSupervisorList = function (supervisor_id) {
    console.log("in the add function ");
    const supervisorIndex = this.supervisor.findIndex(index => {  //checking if the supervisor already exists
        return index.supervisor_id.toString() === supervisor_id.toString();
    });
    const updatedSupervisorList = [...this.supervisor]; //new array with all the supervisor_id's stored in supervisor array
    if (supervisorIndex < 0) { //doesnt exist, so create new     
        updatedSupervisorList.push({
            supervisor_id: supervisor_id
        });
        this.supervisor = updatedSupervisorList;
        return this.save();
    }
    else {
        return 0; //task exist - do nothing
    }
}

const Supervisor = mongoose.model('Supervisor', supervisorSchema);

module.exports = Supervisor;