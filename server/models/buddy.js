// const bcrypt = require('bcryptjs/dist/bcrypt');   
const mongoose = require('mongoose');

const buddySchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Employee'
    },
    buddy: [{
        buddy_id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'Employee'
        },
        date: {
            type: Date,
		    default: Date.now
        }
    }]
});

buddySchema.methods.addBuddyToList = function (buddy_id) {
    const buddyIndex = this.buddy.findIndex(index => {  //checking if the buddy already exists}))
        return index.buddy_id.toString() === buddy_id.toString();
    });
    const updatedBuddyList = [...this.buddy];
    if(buddyIndex < 0 ){
        updatedBuddyList.push({
            buddy_id: buddy_id
        });
        this.buddy = updatedBuddyList;
        return this.save();
    }
    else{
        return 0; 
    }
}


const Buddy = mongoose.model('Buddy', buddySchema);

module.exports = Buddy;