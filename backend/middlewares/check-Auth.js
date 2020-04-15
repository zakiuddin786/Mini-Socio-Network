const jwt=require("jsonwebtoken");

const secret =require('../secret/secret');

module.exports = (req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token,secret);
        req.userData={
            email:decodedToken.email,
            userId:decodedToken.userId
        }
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({
            message:"Auth Failed!!"
        })
    }
}