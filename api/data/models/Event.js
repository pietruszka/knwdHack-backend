"use strict";
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
let EventModel = new mongoose.Schema({
    userId: String,
    title: String,
    description: String,
    date: String,
    hours: Number,
    icon: String,
    capacity: Number
});

module.exports = mongoose.model('Event',EventModel);