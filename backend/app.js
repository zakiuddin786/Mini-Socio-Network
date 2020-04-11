const express = require('express');

const app=express();

app.use((req,res,next)=>{
    console.log('first middleware');
    next();
});

app.use((req,res,next)=>{
    res.send('hey I\'m on Express');
});

module.exports = app;