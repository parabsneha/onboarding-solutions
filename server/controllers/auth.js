const { json } = require('express/lib/response');
const { use } = require('../app');
require('../DB/Connection');
const Employee = require("../models/employee");
const Hr = require("../models/Hr");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {SECRET} = require('../config');
 
exports.postLogin = (req, res, next) =>{
    console.log("email", req.body.empEmail);
    console.log("password", req.body.empPassword);
    const empEmail = req.body.empEmail;
    const empPassword = req.body.empPassword;

    Employee.findOne({empEmail:empEmail})
    .then(employee =>{
        if(!employee){
           return res.status(404).send('User not found');
        }
        async function compare(){
        const isMatch = await bcrypt.compare(empPassword, employee.empPassword);
        if(isMatch){
            let token = jwt.sign({
                user_id: employee._id,
                user_name: employee.empFirstName,
                role:employee.role,
                email:employee.empEmail,
                position:employee.empPosition
            },
            SECRET, 
            { expiresIn : "7 days"}
            );

            let result = {
                role:employee.role,
                email:employee.empEmail,
                user_name: employee.empFirstName,
                position:employee.empPosition,
                token: `Bearer ${token}`,
                expiresIn: 168
            };
            console.log("logged in", token);
            console.log(result);
            return res.status(200).send(result);
            // next();

        }else{
            return res.status(401).send('Invalid password');
        }
    }
        compare();
    })
    .catch(err => console.log(err));    
}


// exports.postLogout = (req, res, next) => {
//     req.session.destroy((err)=>{
//         console.log(err);
//         res.send('logged out');
//         // res.redirect('/login');
//     });
// };