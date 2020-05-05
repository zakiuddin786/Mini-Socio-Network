const mongoose =require('mongoose');

const PostSchema =mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    imagePath:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    name: {
        type:mongoose.Schema.Types.String,
        ref:"User"
    },
    likes: [
    {
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        }
    }
    ],
    comments: [
    {
        user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        },
        text: {
        type: String,
        required: true
        },
        name: {
        type: String
        },
        avatar: {
        type: String
        },
        date: {
        type: Date,
        default: Date.now
        }
    }
    ],
    date: {
    type: Date,
    default: Date.now
    }
});

module.exports=mongoose.model("Post",PostSchema);