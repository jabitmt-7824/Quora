const express = require("express");
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const db = require("./config/mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo")(session);
const passport = require("passport");
const localStrategy = require("./config/passport-local-strategy");
const flash = require("connect-flash");
const flashMiddleware = require("./config/flashMiddleware");
const googleStrategy = require("./config/passport-google-strategy");

const app = express();

app.use(express.static(path.join(__dirname,'./assets')));

app.use("/uploads", express.static(__dirname+"/uploads"));

app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(session({
    name: 'Quora',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new mongoStore(
        {
            mongooseConnection : db,
            autoRemove: 'disabled'
        
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(flashMiddleware.setFlash);

app.use("/" , require("./routes/index"));

app.listen(port,function(err){
    if(err)
    {
        console.log(`error: ${err}`);
        return;
    }
    console.log("server is successfully setup and running on the port:", port);
});