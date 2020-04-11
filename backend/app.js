const express = require('express');
const bodyParser=require('body-parser');

const app=express();

const Post =require('./models/post');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.post("/api/posts",(req,res,next)=>{
    const post=new Post({
        title:req.body.title,
        content:req.body.content
    });
    console.log(post);
    res.status(201).json({
        message:"The Post is Successfully added"
    });
});

app.use('/api/posts',(req,res,next)=>{
    const posts=[
        {
            id:"123",
            title:"First post",
            content:"This is from server1"
        },
        {
            id:"1234",
            title:"second post",
            content:"This is from server2"
        },
        {
            id:"12345",
            title:"third post",
            content:"This is from server3"
        }
        
    ];
    res.status(200).json({
        message:"posts fetched successfully",
        posts:posts
    });
});

module.exports = app; 