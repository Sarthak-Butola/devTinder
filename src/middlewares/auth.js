const authUser = (req,res,next)=>{
    const token = "wasd";
    const isAuthorisedToken = token === "wasd";
    if(!isAuthorisedToken){
        res.status(401).send("unauthorised access");
    }
    next();
 }
 module.exports = {
    authUser,
 }