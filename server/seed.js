const express = require('express');
const Employee = require('./models/employee');
const connectDB = require('./DB/Connection');

const empFirstName = "admin1";
const empLastName = "";
const empEmail = process.argv.slice(2)[0];
const empPassword = makeid(8);
const role = "admin";
connectDB();
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

// console.log(makeid(5));

if(!empEmail){
    console.error("Please provide an email as a parameter");
    return 0;
}

const employee = new Employee({ empFirstName, empLastName, empEmail, empPassword, role });
employee.save()
.then((result)=>{
 console.log("email : ",result.empEmail);
 console.log("password : ",empPassword);
})
.catch(err=>console.log(err));




