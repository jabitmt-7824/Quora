const express = require("express");
const router = express.Router();
const passport = require("passport");

const userController = require("../controllers/userController");

// for signup page
router.get("/signup", userController.signupPage);

// for signup user
router.post("/signup-user", userController.signupUser);

// for signin user
router.post("/signin-user", passport.authenticate("local", {failureRedirect: "/"}) ,userController.signinUser);

// for user homepage
router.get("/home", passport.checkAuthentication, userController.homePage);

// for logout
router.get("/logout", userController.signOut);

//for google authentication
router.get("/auth/google", passport.authenticate("google",{scope:['profile','email']}));
router.get("/auth/google/callback",passport.authenticate("google",{failureRedirect:"/"}), userController.signinUser);


router.get("/reset-page", passport.checkAuthentication, userController.resetPage);

router.post("/reset-pass", passport.checkAuthentication, userController.resetPass);

module.exports = router;