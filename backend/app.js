const express = require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const path= require('path');
// const cors=require('cors');

const postRoutes=require('./routes/posts');
const userRoutes = require('./routes/user');

const secret=require('./secret/secret');

mongoose.connect(secret
,{useUnifiedTopology: true , useNewUrlParser: true})
.then(()=>{
    console.log('DB Successfully connected');
})
.catch(()=>{
    console.log('Error Occurred while connecting to DB!!');
})

const app=express();

const Post =require('./models/post');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use("/images",express.static(path.join("backend/images")));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);


module.exports = app; 