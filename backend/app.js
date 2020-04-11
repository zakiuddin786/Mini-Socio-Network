const express = require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');

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
    post.save();
    console.log(post);
    res.status(201).json({
        message:"The Post is Successfully added"
    });
});

app.delete("/api/posts/:id",(req,res,next)=>{
    Post.deleteOne({_id:req.params.id}).then((result)=>{
        console.log("deleted the post!");
        res.status(200).json({
            message:"Post Deleted !!"
        });
    });
    // console.log(req.params.id);
});

app.use('/api/posts',(req,res,next)=>{
Post.find().then(documents =>{
    res.status(200).json({
        message:"posts fetched successfully",
        posts:documents
    });
  })
  .catch((err)=>{
      console.log('Error Occurred while deleting!!'+err);
  });
});

module.exports = app; 