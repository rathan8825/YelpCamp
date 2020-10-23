var express = require("express");
var router	= express.Router();
var passport =	require("passport");
var user	= require("../models/user")

// Home/landing page
router.get("/", function(req, res){
	res.render("landing");
});


//AUTH ROUTES

//show register form

router.get("/register", function(req, res){
	res.render("register");
 });
// handle singup logic

router.post("/register", function(req, res){
	var newUser = new user({username: req.body.username});
	user.register(newUser, req.body.password, function(err, user){
		if(err){
			//err is an object given by passport js i.e password can't be blank..username exists etc
			req.flash("error", err.message);
			return res.redirect("register");
		} else {
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to Yelpcamp " + user.username);
				res.redirect("/campgrounds");
			});
		} 
	});
});


// show LOGIN form
router.get("/login", function(req,res){
	res.render("login");
});

router.post("/login", passport.authenticate( "local",{
	successRedirect: "/campgrounds",
	failureRedirect: "/login",
}), function(req,res){
	
});

// LOGOUT route

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success","logged you out!!");
	res.redirect("/campgrounds");
});


 

module.exports = router;