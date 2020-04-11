const express = require('express');
const bodyParser=require('body-parser');

const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Header",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.post("api/posts",(req,res,next)=>{
    const post=req.body;
    console.log(post);
    res.send(201).json({
        message:"The Post is Successfully added"
    });
});

app.use('/api/posts',(req,res,next)=>{
    const posts=[
        {
            id:"123",
            title:"First post",
            content:"This is from server"
        },
        {
            id:"1234",
            title:"second post",
            content:"This is from server"
        },
        {
            id:"12345",
            title:"third post",
            content:"This is from server"
        }
        
    ];
    res.status(200).json({
        message:"posts fetched",
        posts:posts
    });
});

module.exports = app; 