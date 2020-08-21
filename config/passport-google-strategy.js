const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/user");

passport.use(new GoogleStrategy({
    clientID: "666481044172-iukd955b8g7jp7fuauc9c7hhp7ef5pb2.apps.googleusercontent.com",
    clientSecret: "kr20gEmCCt4kC0XbT1tDgLju",
    callbackURL: "http://localhost:8000/user/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value }).exec(function (err, user) {
            if (err) {
                console.log("error in google aouth", err);
                return;
            }
            console.log(profile);
            if (user) {
                done(null, user);
            }
            else {
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    avatar: profile.photos[0].value,
                    password: crypto.randomBytes(20).toString("hex")
                },
                    function (err, user) {
                        if (err) {
                            console.log("error in creating user in google oauth ", err);
                            return;
                        }
                        done(null, user);
                    });
            }
        });

    })
);

module.exports = passport;