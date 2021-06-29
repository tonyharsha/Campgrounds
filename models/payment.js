var mongoose=require("mongoose")
var Comment = require("./comment");
var Campground = require("../models/campgrounds");
var Review=require("./review");
//Schema setup
var paymentSchema=new mongoose.Schema({
 customer:String,
 campname:String,
 price:Number,
 owner:String
});

module.exports=mongoose.model("Payment",paymentSchema);