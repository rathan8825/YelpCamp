var express = require("express");
var campground = require("../models/campground");
var comment		= require("../models/comment");
var router	= express.Router();
var bodyParser = require('body-parser');
var middleware = require("../middleware");

router.use(bodyParser.urlencoded({ extended: false }));

///////////////////////////////////
// COMMENTS FORM //
///////////////////////////////////

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
	//find campground by id
	campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new",{campground: campground});
		}
	});
	
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	//look up campground using id
	campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong!");
					console.log(err);
				}else {
					//add username and id to the comment
					comment.author.username = req.user.username;
					comment.author.id = req.user.id;
					//save comment
					comment.save();
					campground.comments.push(comment);
                    campground.save();
					req.flash("success", "Comment added successfully");
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});

});

//EDIT comment route
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id , comment: foundComment});
		}
	});
});

//UPDATE comment route

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership,  function(req, res){
	comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

//DESTROY route
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	comment.findByIdAndRemove(req.params.comment_id, req.body.comment, function(err, deletedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});





module.exports = router;