"use strict";
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
let UserModel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        toLowerCase: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: String,
    lastname: String,
    zipcode: String,
    phone: String,
    address: String
});

// UserModel.plugin(searchPlugin, {
//     fields: ['name'],
//     stemmer: 'PorterStemmer',
//     distance: 'JaroWinklerDistance',
//     keywordsPath: 'name'
// });
//
// UserModel.index({ email: 1 }, { unique: true });
// UserModel.index({ name: "text" });


/**
 * Check if passed password and hashed password matched
 */
UserModel.methods.comparePassword = function comparePassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
};

/**
 * Before saving new DB item, hash password field
 */
UserModel.pre('save', function saveHook(next) {
    const user = this;

    if (!user.isModified('password')) return next();


    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) { return next(saltError); }

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) { return next(hashError); }

            user.password = hash;

            return next();
        });
    });
});

module.exports = mongoose.model('UserOrganisation',UserModel);