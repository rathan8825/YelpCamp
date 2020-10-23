var express 	= require("express"),
 	app 		= express(),
 	bodyParser 	= require("body-parser"),
 	mongoose 	= require("mongoose"),
	flash		= require("connect-flash"),
	passport	= require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	campground	= require("./models/campground"),
	comment		= require("./models/comment"),
	user		= require("./models/user"),
	seedDB		= require("./models/seeds");

//routing of files
var campgroundRoutes = require("./routes/campground"),
	commentRoutes	=	require("./routes/comments"),
	indexRoutes		= require("./routes/index");




//connect to mongodb..{ useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true, useUnifiedTopology: true });

// tell express to use bodyparser
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
//using css sheets
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//tells express to use flash and it is always placed before passport configuration
app.use(flash());


//PASSPORT CONFIGURATION

app.use(require("express-session")({
	secret: "i live in germany",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// includes nav bar with every page by checking the user is logged in or not 
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// tell the app to use the refactored routes
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);




app.listen(process.env.PORT=3000, process.env.IP, function(){
	console.log("The YelpCamp server has started");
});