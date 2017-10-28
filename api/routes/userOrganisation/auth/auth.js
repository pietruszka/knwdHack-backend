'use strict';
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('UserOrganisation');
const config = require('./../../../data/config');

module.exports = (req, res, next) =>{
    if(!req.headers.authorization) return res.status(401).end();

    const token = req.headers.authorization.split(' ')[1];

    return jwt.verify(token, config.JWT_SECRET, (err, decoded)=>{
        if(err) return res.status(401).end();

        const userId = decoded.sub;

        return User.findById(userId, (err, user)=>{
            if(err || !user) return res.status(401).end();
            req.userId = userId;
            return next();
        });
    });
};