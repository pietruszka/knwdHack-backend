const express = require('express');
const router = express.Router();
const userRoutes = require('./userVolunteer');
const userOrganisation = require('./userOrganisation');
const event = require('./event');

router.use('/userVolunteer', userRoutes);
router.use('/userOrganisation', userOrganisation);

router.use(event);


module.exports = router;