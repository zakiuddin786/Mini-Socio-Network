const express = require('express');
const Post=require('../models/post');

const router=express.Router();


router.post("",(req,res,next)=>{
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

router.delete("/:id",(req,res,next)=>{
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

router.get("/:id",(req,res,next)=>{
    Post.findById(req.params.id).then(post=>{
        console.log("fetching from DB!");
        if(post){
            res.status(200).json(post);
        }
        else{
            console.log("Error Post Not Found!!");
            res.status(404).json({
                message:"Post Not Found!!"
            });
        }
    })
})

router.put("/:id",(req,res,next)=>{
    console.log("i'm in the put");
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
    }).catch((err)=>{
        console.log('Unable to Delete!!'+err);
    })
})

router.use("",(req,res,next)=>{
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

module.exports = router;
