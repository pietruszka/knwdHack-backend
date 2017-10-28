"use strict";
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
let EventModel = new mongoose.Schema({
    userId: String,
    title: String,
    content: String,
    date: {
        type: Date,
        default: new Date()
    }

});

module.exports = mongoose.model('Event',EventModel);