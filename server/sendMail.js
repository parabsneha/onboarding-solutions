const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: "par007@chowgules.ac.in",
        pass: "su170277",
    }
});

var mailOptions = {
    from : 'parabsneha19@gmail.com',
    to : 'parabsneha09@gmail.com',
    subject : 'email from node js',
    text: `hi sneha , have a nice day at work` 
};

transporter.sendMail(mailOptions, function(error, info){
   if(error){
       console.log(error);
   } else{
       console.log('email sent:' + info.response);
   }
});

// module.exports.sendResetyEmail = async(email, token) =>{
//     var url = "http://localhost:3000";
// }

// module.exports.sendVerifyEmail = async (email, token) =>{
//     var url = "http://localhost:3000"
// }