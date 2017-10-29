"use strict";
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
let EventModel = new mongoose.Schema({
    userId: String,
    title: String,
    description: String,
    date: String,
    icon: String
});

module.exports = mongoose.model('Event',EventModel);