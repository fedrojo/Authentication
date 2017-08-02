var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    localStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    User                    = require("./models/user"),
    expressSession          = require("express-session"),
    LinkedInStrategy        = require('passport-linkedin').Strategy;;


var app = express();

var LINKEDIN_API_KEY = "866ygcrfy3u6wb";
var LINKEDIN_SECRET_KEY = "7uGWnXYci6yEGq27";

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
// passport.use(new localStrategy(User.authenticate()));
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

//This are for the linkedinstrategy
// Use the LinkedInStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and LinkedIn profile), and
//   invoke a callback with a user object.
passport.use(new LinkedInStrategy({
    consumerKey: LINKEDIN_API_KEY,
    consumerSecret: LINKEDIN_SECRET_KEY,
    callbackURL: "https://webdevbootcamp-fedrojo.c9users.io/auth/linkedin/callback"
  },
  function(token, tokenSecret, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's LinkedIn profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the LinkedIn account with a user record in your database,
      // and return that user instead.
      console.log(profile);
      return done(null, profile);
    });
  }
));



//Connect and will create if DB does not exist
mongoose.connect("mongodb://localhost/auth_demo__linkedin_app", {useMongoClient: true});
mongoose.Promise = global.Promise;

// //===========================
// //ROUTES
// //===========================

// app.get("/", function(req, res) {
//   res.render("home"); 
// });

// app.get("/secret", isLoggedIn , function(req, res){
//     res.render("secret");
// })

// //Auth Routes
// app.get("/register", function(req, res){
//     //show signup form
//     res.render("register");
// })

// app.post("/register", function(req, res){
//     //register
//     var username = req.body.username;
//     var password = req.body.password;
    
//     User.register(new User({username: username}), password, function(err, user){
//         if (err){
//             console.log(err);
//             res.render("register")
//         } else {
//             console.log(user);
//             passport.authenticate("local")(req, res, function(){
//                 res.redirect("/");
//             })
            
//         }
//     });
// });

// // Login routes
// app.get("/login", function(req, res){
//     //show signup form
//     res.render("login");
// })

// //login logic
// //middleware
// app.post("/login", passport.authenticate("local", {
//     successRedirect: "/secret",
//     failureRedirect: "/login"
//     }),
//     function(req, res){
// });

// app.get("/logout",function(req, res){
//   req.logout();
//   res.redirect("/");
// });

//===================================
// LINKEDIN METHODS
//===================================


// GET /auth/linkedin
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in LinkedIn authentication will involve
//   redirecting the user to linkedin.com.  After authorization, LinkedIn will
//   redirect the user back to this application at /auth/linkedin/callback
app.get('/auth/linkedin',
  passport.authenticate('linkedin'),
  function(req, res){
    // The request will be redirected to LinkedIn for authentication, so this
    // function will not be called.
  });

app.get('/', function(req, res){
    console.log("Got Here");
  res.render('home', { user: req.user });
});

app.get('/secret', isLoggedIn, function(req, res){
    console.log("secret");
    res.render('secret', { user: req.user });
});

app.get('/login', function(req, res){
  res.render('login', { user: req.user });
});


// GET /auth/linkedin/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/linkedin/callback',
  passport.authenticate('linkedin', { 
      successRedirect: "/secret",
      failureRedirect: '/login' }),
      function(req, res) {}
);


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    } else {
        res.redirect("/login");
    }
}

function authenticatePassport(req, res, next){
    
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server started...");
    
});