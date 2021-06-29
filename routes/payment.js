var express=require("express");
var router=express.Router();
// var sanitizer=require("express-sanitizer");
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");
var Review = require("../models/review");
var Comment=require("../models/comment");


//payment

// router.get("/payment",middleware.isLoggedIn,function(req,res){
//         Campground.findById(req.params.id,function(error,foundCampground){
//                res.render("payments/payment",{campground:foundCampground}) 
//         })
//     }) 

router.get("/new",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(error,foundcampground){
        if(error){
            console.log(error);
        }else{
           res.render("payments/new",{campground:foundcampground}) 
        }
    })
    
})

router.get("/buy",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(error,foundcampground){
        if(error){
            console.log(error);
        }else{
           res.render("payments/buy",{campground:foundcampground}) 
        }
    })
    
})

module.exports=router;