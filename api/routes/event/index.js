"use strict";
let express = require('express');
const {get, getAll, add, change, deleteEvent} = require('./event.controller');
const authChecker = require('./../userOrganisation/auth/auth');
let router = express.Router();
router
    .get('/event/:id', get)
    .get('/event', getAll)
    .post('/event', authChecker, add)
    .put('/event', authChecker, change)
    .delete('/event/:id', authChecker, deleteEvent);



module.exports = router;