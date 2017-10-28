"use strict";
const mongoose = require('mongoose');
const User = mongoose.model('UserVolunteer');
const PassportLocalStrategy = require('passport-local').Strategy;


module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, email, password, done)=>{

    let _requestData = {
        email: email.trim(),
        password: password.trim()
    };
    User.find({email: req.body.email}, (err, users)=>{
        if(err) res.status(404).send("Name err");

        if(users.length){
            return done("MongoError2");

        }else{
            _requestData = {
                email: email.trim(),
                password: password.trim()
            };


            const newUser = new User(_requestData);
            newUser.save((err,userr)=>{
                if(err) return done(err);
                return done(null);

            });
        }
    });
});