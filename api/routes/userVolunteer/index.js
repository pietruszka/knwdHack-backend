"use strict";
let express = require('express');
const {registerUser,loginUser, mailConfirmation, changeUser} = require('./user.controller');

let router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/confirmmail/:id', mailConfirmation);
router.put('/change', changeUser);

module.exports = router;

