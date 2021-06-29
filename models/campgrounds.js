var mongoose=require("mongoose")
var Comment = require("./comment");
var Review=require("./review");
//Schema setup
var campgroundSchema=new mongoose.Schema({
    title:String,
    price:String,
    image:String,
    description:String,
    createdAt: {type:Date,default:Date.now},
    author:{
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username: String
    },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    }
});

module.exports=mongoose.model("Campground",campgroundSchema);