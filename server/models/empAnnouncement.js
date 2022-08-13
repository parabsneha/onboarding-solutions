const mongoose = require('mongoose');

const empAnnouncementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Employee'
    },
    announcement: [{
        announcement_id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'announcement'
        },
        date:{
            type: Date,
            default: Date.now(),
        },
        description:{
            type: String
        }
    }]    
},
{
    timestamps: true,
});

const empannouncement = mongoose.model('empannouncement', empAnnouncementSchema);

module.exports = empannouncement;  
