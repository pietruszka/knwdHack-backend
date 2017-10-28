"use strict";
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let config = require('./config');

mongoose.connect(config.DB_URL, { useMongoClient: true })
    .then(() =>  console.log('connection succesful'))
    .catch((err) => console.error(err));

//register mongoose models
require('./models/UserVolunteer');
require('./models/UserOrganisation');