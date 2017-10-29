"use strict";
let express = require('express');
const {registerUser,loginUser, mailConfirmation} = require('./user.controller');

let router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/confirmmail/:id', mailConfirmation);


module.exports = router;

