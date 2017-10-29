"use strict";
const mongoose = require('mongoose');
const User = mongoose.model('UserVolunteerTemp');
const PassportLocalStrategy = require('passport-local').Strategy;
const Mail = require('./../../../other/Mail');


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
                password: password.trim(),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                zipcode: req.body.zipcode,
                phone: req.body.phone,
                address: req.body.address,
                score: 0
            }; //tutaj dorobić!


            const newUser = new User(_requestData);
            newUser.save((err,userr)=>{
                if(err) return done(err);
                new Mail().sendConfirmRegister(newUser.email, userr._id,"userVolunteer")
                    .then(success=>done(null))
                    .catch(fail=>done(fail));

            });
        }
    });
});