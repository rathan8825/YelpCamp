var campground = require("../models/campground");
var comment		= require("../models/comment");
// All middleware goes here

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
		if(req.isAuthenticated()){
			campground.findById(req.params.id, function(err, foundCampground){
				if(err){
					req.flash("error", "Campground not found");
					res.redirect("back");
				} else {
					//does the user own the campground
					//.equals will check whether both are equal or not
					if(foundCampground.author.id.equals(req.user._id)){
						next();
					}else {
						req.flash("error", "You don't have permission to do that");
						res.redirect("back");
					}
				}
			});
		}else {
			req.flash("error", "You have to be logged in to do that");
			res.redirect("back");
		}

	}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated){
		comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else{
				//does user owns a comment
				if(foundComment.author.id.equals(req.user._id)){
					next();
			} else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}else{
		req.flash("error","You need to be logged in to do that");
		res.redirect("/login");
	}
}


module.exports = middlewareObj