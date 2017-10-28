"use strict";
//launching DB connection
require('./api/data/db');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const path = require('path');
const expressValidator = require('express-validator');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const compression = require('compression');
const fs = require('fs');
const mongoose = require('mongoose');

const routeMain = require('./api/routes');
const localSignupStrategyVolunteer = require('./api/routes/userVolunteer/auth/registerUser');
const localSignupStrategyOrganisation = require('./api/routes/userOrganisation/auth/registerUser');
const localLoginStrategyVolunteer = require('./api/routes/userVolunteer/auth/loginUser');
const localLoginStrategyOrganisation = require('./api/routes/userOrganisation/auth/loginUser');
class Application {
    constructor(){
        this.app = new express();
        this.init();
        this.app.listen(3000, ()=>{console.log("server started")});
    };

    middleware(){
        this.app.use(compression());
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use(expressValidator({
            errorFormatter: function(param, msg, value) {
                var namespace = param.split('.')
                    , root    = namespace.shift()
                    , formParam = root;

                while(namespace.length) {
                    formParam += '[' + namespace.shift() + ']';
                }
                return {
                    param : formParam,
                    msg   : msg,
                    value : value
                };
            }
        }));
        this.app.use(passport.initialize());
        passport.use('local-signupVolunteer', localSignupStrategyVolunteer);
        passport.use('local-signupOrganisation', localSignupStrategyOrganisation);
        passport.use('local-loginVolunteer', localLoginStrategyVolunteer);
        passport.use('local-loginOrganisation', localLoginStrategyOrganisation);
        this.app.use('/', express.static(__dirname + '/build'));
    };

    routes(){
        //main route
        this.app.use('/api', routeMain)
    };


    init(){
        this.middleware();
        this.routes();
    };
}

new Application();