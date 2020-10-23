var express = require("express");
var mongoose = require("mongoose");
var router	= express.Router();
var campground = require("../models/campground");
var middleware = require("../middleware");

mongoose.set('useFindAndModify', false);

// INDEX route - all campgrounds page
router.get("/campgrounds", function(req, res){
	
	//Get all campgrounds from mongodb
	campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			res.render("campground/index",{campgrounds: allCampgrounds});
		}
	});
});
//NEW route
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
	res.render("campground/new");
});
// SHOW- shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
	//find the campground with provided id
	// find the id and populate the comment item .exec executes the query
	campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//render show the template with the campground
			res.render("campground/show",{campground: foundCampground});
		}
	});
	
});

// CREATE - add new campground to the DB
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
	//get data from the form page and add to campground array
	//extract the name variable from the form
	var name = req.body.name;
	var price = req.body.price;
	// extract the image variable from the form by means of "name" attribute
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username,
	}
	// create a new object of type campground
	var newCampground = {name:name, price:price, image:image, description: desc, author:author};
	// push into campground db 
	campground.create(newCampground, function( err , newlyCreated){
		if(err){
			console.log(err);
		} else {
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
	
});

//EDIT campground router

router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	campground.findById(req.params.id, function(err, foundCampground){
		res.render("campground/edit", {campground : foundCampground});
	});
});


//UPDATE campground route

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
	//find and update the correct campground
	campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	
});

//DESTROY/DELETE route
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
	campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
	
});







module.exports = router;
