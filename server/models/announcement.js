const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    date:{
        type: Date,
        default: Date.now(),
    },
    description:{
        type: String
    }
},
{
    timestamps: true,
});

// announcementSchema.index({ "date": 1 }, { expireAfterSeconds: 30 });

const announcement = mongoose.model('announcement', announcementSchema);

module.exports = announcement;  
