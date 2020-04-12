const express = require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const cors=require('cors');

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
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});


app.post("/api/posts",(req,res,next)=>{
    const post=new Post({
        title:req.body.title,
        content:req.body.content
    });
    post.save().then(createdPost =>{

        console.log(post);
        res.status(201).json({
            message:"The Post is Successfully added",
            postId:createdPost._id
        });
    });
});

app.delete("/api/posts/:id",(req,res,next)=>{
    Post.deleteOne({_id:req.params.id}).then((result)=>{
        console.log("deleted the post!");
        res.status(200).json({
            message:"Post Deleted !!"
        }).catch((err)=>{
            console.log(err);
            // process.exit(1);
        });
    });
    // console.log(req.params.id);
});

app.put("/api/posts/:id",(req,res,next)=>{
    const post =new Post({
        _id:req.body.id,
        title:req.body.title,
        content:req.body.content
    })
    Post.updateOne({_id:req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({
            message:"Updating Successfull..."
        });
    })
})

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