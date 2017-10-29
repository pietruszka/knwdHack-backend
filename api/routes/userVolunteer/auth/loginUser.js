'use strict';
const mongoose = require('mongoose');
const UserVolunteer = mongoose.model('UserVolunteer');
const UserOrganisation = mongoose.model('UserOrganisation');
const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local');
const config = require('./../../../data/config');



/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
}, (req, email, password, done) => {
    const userData = {
        email: email.trim(),
        password: password.trim()
    };

    // find a user by email address
    return UserVolunteer.findOne({ email: userData.email }, (err, user) => {
        if (err) { return done(err); }

        if (!user) {
            // const error = new Error('Nieprawidłowy email lub hasło.');
            // return done(error);
            UserOrganisation.findOne({email: userData.email}, (err, userOrg)=> {
                if(err) return done(err);
                if(userOrg) {
                    return userOrg.comparePassword(userData.password, (passwordErr, isMatch) => {
                        if (err) { return done(err); }

                        if (!isMatch) {
                            const error = new Error('Nieprawidłowe email lub hasło.');
                            error.name = 'IncorrectCredentialsError';

                            return done(error);
                        }

                        const payload = {
                            sub: userOrg._id
                        };
                        // create a token string
                        const token = jwt.sign(payload, config.JWT_SECRET);
                        const data = {
                            email: userOrg.email,
                            type: "organisation"
                        };

                        return done(null, token, data);
                    });
                }
                else return done("Missing organisation");
            });
        }else{
            // check if a hashed user's password is equal to a value saved in the database
            return user.comparePassword(userData.password, (passwordErr, isMatch) => {
                if (err) { return done(err); }

                if (!isMatch) {
                    const error = new Error('Nieprawidłowe email lub hasło.');
                    error.name = 'IncorrectCredentialsError';

                    return done(error);
                }

                const payload = {
                    sub: user._id
                };
                // create a token string
                const token = jwt.sign(payload, config.JWT_SECRET);
                const data = {
                    email: user.email,
                    type: "volunteer"
                };

                return done(null, token, data);
            });
        }
    });
});