const checkRole = (roles,position) => (req, res, next) =>{
    console.log("role", req.user.role);
    console.log("position", req.user.empPosition);
if(roles.includes(req.user.role))
{
    if(req.user.role == "employee"){
        if(position.includes(req.user.empPosition)){
            return next();
        }
        else{
            return res.status(401).json("Unauthorized user");
        }
    }
    next();
}
else{
    res.status(401).json("Unauthorized user");
}
}

const authEmployee = role => (req, res, next) =>
!role.includes(req.user.role)
    ? res.status(401).json("Unauthorized user")
    : next();
    

module.exports ={
    checkRole,
    authEmployee
}