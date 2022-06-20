const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Employee'
    },
    mentor: [{
        mentor_id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Employee'
        },
        date: {
            type: Date,
		    default: Date.now
        }
    }]
});


mentorSchema.methods.addToMentorList = function (mentor_id) {
    const mentorIndex = this.mentor.findIndex(index => {  //checking if the mentor already exists
        return index.mentor_id.toString() === mentor_id.toString();
    });
    const updatedMentorList = [...this.mentor]; //new array with all the mentor_id's stored in mentor array
    if (mentorIndex < 0) { //doesnt exist, so create new     
        updatedMentorList.push({
            mentor_id: mentor_id
        });
        this.mentor = updatedMentorList;
        return this.save();
    }
    else {
        return 0; //mentor exist - do nothing
    }

}

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;