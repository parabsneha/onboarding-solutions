// const express = require('express');
// const app = express();
// const morgan = require('morgan');
// const bodyParser = require('body-parser');

// const toDoRoutes = require('./api/routes/toDoList');


// app.use(morgan('dev'));
// app.use(bodyParser.urlencoded({extended: false})); 
// app.use(bodyParser.json()); 

// app.use('/toDoList', toDoRoutes); //a req to /products will be forwarded to app.js file 

// app.use((req, res, next)=> {
//     const error = new Error('Not Found');
//     error.status=404;
//     next(error);
// })

// app.use((error, req, res, next) => {
//     res.status(error.status || 500);
//     res.json({
//         error: {
//             message: error.message
//         }
//     });
// });


// module.exports = app;