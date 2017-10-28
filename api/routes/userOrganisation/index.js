"use strict";
let express = require('express');
const {registerUser} = require('./user.controller');

let router = express.Router();
router.post('/register', registerUser);


module.exports = router;