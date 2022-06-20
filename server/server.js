const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const connectDB = require('./DB/Connection');
const adminRoutes = require('./routes/admin');
const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/auth');
const Employee = require('./models/employee');
const hrRoutes = require('./routes/hr');
const morgan = require("morgan");
// const URI = "mongodb+srv://myDb:su170277@cluster0.uygmz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const app = express();
const passport = require('passport'); 
require('dotenv').config();
connectDB();

const store = new MongoDBStore({
    uri:process.env.APP_DB,
    collection: 'sessions'
});
app.use(cors());
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json()); 
app.use(passport.initialize());
require("./middleware/passport")(passport);

app.get('/', (req, res, next)=>{
    console.log("status OK ");
    res.sendStatus(200);
});


app.use(morgan("tiny"));

app.use('/admin', adminRoutes); 
app.use('/employee', employeeRoutes);
app.use('/hr',hrRoutes);
app.use(authRoutes);

const port = process.env.PORT || 3003;

const server = http.createServer(app); 

server.listen(port);