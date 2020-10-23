var mongoose = require("mongoose");
// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	price:String,
	image: String,
	description: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
		username: String,
	},
	comments:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "comment"
		}
	]
});
//compile it into a model
module.exports = mongoose.model("campground", campgroundSchema);