const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    date:{
        type: Date
    },
    topic:{
        type: String
    },//destype markdown || text 
    objective:{
        type: String
    },//
    category:{
        type:String //hr or admin or IT .
    },
    personResponsible:{ 
        type: mongoose.Schema.Types.ObjectId, refPath: 'category'
    },
    estimatedTime:{
        type:String
    }
    // session rating - employee
    // session feedback comments- employee
    // supervisor feedback comments only if assignment if ses then no comments

},
{
    timestamps: true,
});



const Task = mongoose.model('Task', taskSchema);

module.exports = Task;  