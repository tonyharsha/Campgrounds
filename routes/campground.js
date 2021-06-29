var express=require("express");
var router=express.Router();
// var sanitizer=require("express-sanitizer");
var Campground=require("../models/campgrounds");
var middleware=require("../middleware");
var Review = require("../models/review");
var Comment=require("../models/comment");
var Payment=require("../models/payment");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
        var noMatch = null;
    if(req.query.search){
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // Get all campgrounds from DB gi global ignorecase
        Campground.find({title: regex}, function(err, allCampgrounds){
           if(err){
               console.log(err);
           } else {
              // if(allCampgrounds.length < 1) {
              //     noMatch = "No campgrounds match that query, please try again.";
              // }
              res.render("campgrounds/index",{campgrounds:allCampgrounds});
           }
        });
    }
    else { 
        Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
    }
});

//create add new campground to db
//create route
router.post("/",middleware.isLoggedIn,function(req,res){
    var name=req.body.name;
    var price=req.body.price;
    var image=req.body.image;
    var desc=req.body.desc;
    var author={
        id: req.user._id,
        username:req.user.username
    };
    var newcampground={ title: name ,price :price ,image: image, description:desc,author:author}
    //create a new campground and save to database
    Campground.create(newcampground,function(error,newlycreated){
        if(error){
            console.log(error);
        }else{
             //redirect back yo campgrounds
             req.flash("success","Successfully added campground")
             res.redirect("/campgrounds")
        }
    })
})

//new show form to create a new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new")
})

// //show route
// router.get("/:id",function(req,res){
//       //find the campground with provided id
//       //comment are stored as objectid's in array to dispaly the actual comment we use populate function which extrat the string from thst objectid
//       Campground.findById(req.params.id).populate("comments").exec(function(error,foundCampground){
//           if(error){
//               console.log(error);
//           }else{
//                 //render show template with that campground
//                 // console.log(foundCampground)
//              res.render("campgrounds/show",{campground:foundCampground});
//           }
//       })
// })

// SHOW - shows more info about one campground
router.get("/:id", function (req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit campground
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
        Campground.findById(req.params.id,function(error,foundCampground){
               res.render("campgrounds/edit",{campground:foundCampground})  
        })
    }) 
   

//update campground
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    //find and update correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(error,updatedCampground){
        if(error){
            res.redirect("/campgrounds");
        }else{
            req.flash("success","Updated successfully")
            res.redirect("/campgrounds/"+req.params.id)
        }
    })
    //redirect to updated campground(show page)
})

// //delete campground
// router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
//     Campground.findByIdAndRemove(req.params.id,function(error){
//         if(error){
//             res.redirect("/campgrounds");
//         }else{
//             req.flash("success","Deleted the campground!!")
//             res.redirect("/campgrounds");
//         }
//     })
// })
// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            Comment.deleteMany({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.deleteMany({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Campground deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});

//payment

router.get("/:id/payment",middleware.isLoggedIn,function(req,res){
        Campground.findById(req.params.id,function(error,foundCampground){
               res.render("campgrounds/payment",{campground:foundCampground}) 
        })
    }) 

router.get("/:id/pay",middleware.isLoggedIn,function(req,res){
        Campground.findById(req.params.id,function(error,foundCampground){
               res.render("campgrounds/pay",{campground:foundCampground}) 
        })
    }) 

router.post("/:id/",middleware.isLoggedIn,function(req,res){

        Campground.findById(req.params.id,function(error,foundCampground){
                    var customer=req.user.username;
                    var campname=foundCampground.title;
                    var price=foundCampground.price;
                    var owner=foundCampground.author.username;
                    var newpayment={ customer:customer,campname:campname,price:price,owner:owner}
                    Payment.create(newpayment,function(error,newpayment){
                    if(error){
                        console.log(error);
                    }else{
                        res.render("campgrounds/buy",{campground:foundCampground})  
                    }
                })   
        })
    }) 

// router.post("/:id/",middleware.isLoggedIn,function(req,res){
//         Campground.findById(req.params.id,function(error,foundCampground){
            
//                res.render("campgrounds/buy",{campground:foundCampground}) 
//         })
//     }) 

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports=router;