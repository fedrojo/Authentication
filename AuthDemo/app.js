var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    User                    = require("./models/user"),
    expressSession          = require("express-session");

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(expressSession({
    secret: "This is a first test for encoding",
    resave: false,
    saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());

//This are defined on passport-local-mongus
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//Connect and will create if DB does not exist
mongoose.connect("mongodb://localhost/auth_demo_app", {useMongoClient: true});
mongoose.Promise = global.Promise;

//===========================
//ROUTES
//===========================

app.get("/", function(req, res) {
   res.render("home"); 
});

app.get("/secret", isLoggedIn , function(req, res){
    res.render("secret");
})

//Auth Routes
app.get("/register", function(req, res){
    //show signup form
    res.render("register");
})

app.post("/register", function(req, res){
    //register
    var username = req.body.username;
    var password = req.body.password;
    
    User.register(new User({username: username}), password, function(err, user){
        if (err){
            console.log(err);
            res.render("register")
        } else {
            console.log(user);
            passport.authenticate("local")(req, res, function(){
                res.redirect("/");
            })
            
        }
    });
});

// Login routes
app.get("/login", function(req, res){
    //show signup form
    res.render("login");
})

//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
    }),
    function(req, res){
});

app.get("/logout",function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server started...");
});