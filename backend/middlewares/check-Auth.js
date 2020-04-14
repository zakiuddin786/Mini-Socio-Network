const jwt=require("jsonwebtoken");

const secret =require('../secret/secret');

module.exports = (req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];
        jwt.verify(token,secret);
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({
            message:"Auth Failed!!"
        })
    }
}