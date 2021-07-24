const express = require('express');
const router = express.Routes();
const User=require('../models/users');
const multer= require('multer');
const fs= require('fs');

var storage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null,'./uploads');
    },
    filename: function(req,file,cb){
        cb(null, file.filename+"_"+Date.now()+"_"+file.originalname);
    },
});
var upload= multer({
    storage: storage,
}).single("resume");


// insert
router.post("/add", upload,  (req,res) =>{
    const user =new User({
        name: req.body.name,
        Interviewername: req.body.Intname,
        email: req.body.Email,
        startTime: req.body.StartTime,
        endTime: req.body.EndTime,
        resume: req.file.filename,
    });
    user.save((err)=>{
    if(err){
        res.json({message: err.message, type:'danger'});
    } else{
       req.session.message = {
           type: 'success',
           message: 'Interview added Successfully'
       };
       res.redirect('/');
    }
    });
});

router.get("/", (req,res) =>{
    User.find().exec((err, users)=>{
        if(err){
            res.json({message: err.message});
        } else{
            res.render('index', {
                title: "Home Page",
                users: users,
            });
        }
    });
});

// add interview
router.get("/add", (req,res) =>{
    res.render('add_users', {title: 'Add User'});
});


// edit
router.get("/edit/:id", (req,res) =>{
   let id= req.params.id;
   User.findById(id,(err,user)=>{
       if(err){
           res.redirect('/');
       } else{
           if(user== null){
               res.redirect('/');
           } else{
               res.render("edit_users" , {
                   title: "Edit User",
                   user:user,
               });
           }
       }
   });
 
});

// update
router.post("/update/:id", upload,  (req,res) =>{
    let id=req.params.id;
    let new_resume= '';
    if(req.file){
        new_resume= req.file.filename;
        try{
            fs.unlinkSync("./uploads/" + req.body.old_resume);
        } catch(err){
            console.log(err);
        }
    } else{
        new_resume= req.body.old_resume;
    }
    User.findByIdAndUpdate({
        name: req.body.name,
        Interviewername: req.body.Intname,
        email: req.body.Email,
        startTime: req.body.StartTime,
        endTime: req.body.EndTime,
        resume: new_resume,
    }, (err, result)=>{
        if(err){
            res.json({message: err.message , type:'danger'});
        } else{
            req.session.message= {
                type: 'success',
                message: 'Interview updated Successfully'
            };
            res.redirect("/");
        }
    })
   });

// delete
router.get('/delete/:id' , (req, res) =>{
    let id=req.params.id;
    User.findByIdAndRemove(id , (err , result) =>{
        if(result.resume!=''){
            try{
                fs.unlinkSync('./uploads/'+ result.resume);
            }catch(err){
                console.log(err);
            }
        }
        if(err){
            res.json({message: err.message});
        } else{
            req.session.message= {
                type: 'info',
                message: 'Interview deleted Successfully'
            };
            res.redirect("/");
        }
    });
});
module.exports = router;