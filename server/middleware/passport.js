const {SECRET} = require('../config');
const {Strategy, ExtractJwt} = require('passport-jwt');
    
const Employee = require('../models/employee');

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET
};

module.exports = passport =>{
    passport.use(
        new Strategy(opts, async (payload, done) =>{
            console.log("user id ", payload.user_id);
            await Employee.findById(payload.user_id)
            .then(employee =>{
                if(employee){
                    console.log("in passport function ",employee);
                    return done(null,employee);
                }
                return done(null, false);
            }).catch(err => {
                return done(null, false);
            });
        })
    );
};

