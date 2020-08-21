const User = require("../models/user");

// render login page
module.exports.loginPage = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect("/user/");
    }
    return res.render("login", { title: "Quora | Login" });
}

// render signup page
module.exports.signupPage = function (req, res) {
    return res.render("signup", { title: "Quora | Sign Up" });
}

// signup user
module.exports.signupUser = async function (req, res) {
    try {
        // check password and confirm password are same
        if (req.body.password != req.body.confirm) {
            req.flash("error", "password and confirm password does not match");
            return res.redirect('back');
        }

        // check email already exist
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            // create new user
            await User.upload(req, res, function (err) {
                if (err) {
                    console.log("error", err);
                }
                if (req.file) {
                    let user = User.create({ name: req.body.name, email: req.body.email, avatar: User.avatarPath + '/' + req.file.filename, password: req.body.password });
                }
                else {
                    let user = User.create({ name: req.body.name, email: req.body.email, password: req.body.password });
                }
            });
            req.flash("success", "registered successfully");
            return res.redirect('/');
        } else {
            // if user already exist
            req.flash("error", "This user/email alrready exist");
            return res.redirect('back');
        }

    } catch (err) {
        req.flash("error",err);
        return;
    }
}

module.exports.homePage = function(req, res){
    return res.render("user_home",{title:"Home"});
}

module.exports.signinUser = function(req, res){
    req.flash("success","You have login successfully");
    res.redirect("/user/home");
}

module.exports.signOut = function (req, res) {
    req.logout();
    req.flash("success", "yo have logged out!");
    return res.redirect("/");
}

module.exports.resetPage = function(req, res){
    return res.render("reset", {title: "Reset Password"});
}

module.exports.resetPass = async function(req, res) {
    try{
        let user = await User.findById(req.user.id);
        if(user && user.password === req.body.current){
            if(req.body.new !== req.body.confirm){
                req.flash("error", "password and confirm password does not match");
                return res.redirect("back");
            }
            user.password = req.body.new;
            user.save();
            req.flash("success", "Password reseted successfully");
            return res.redirect("/user/home");
        }
        else{
            req.flash("error", "current password is wrong");
            return res.redirect("back");
        }

    }
    catch(error){

    }
}