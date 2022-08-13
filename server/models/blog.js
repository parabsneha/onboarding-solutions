const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

    description: {
        type: String
    },
    content: {
        type: String
    },
    likes: {
        type: Number,
        default:0
    }
},
{
    timestamps: true,
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;