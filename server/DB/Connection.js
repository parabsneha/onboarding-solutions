const mongoose = require('mongoose');
require('dotenv').config();

// const URI = "mongodb+srv://myDb:su170277@cluster0.uygmz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const URI = process.env.APP_DB;
const connectDB = async () => {
  await mongoose.connect(URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
  console.log('db connected..!');
};

module.exports = connectDB;  
exports.uri = URI;