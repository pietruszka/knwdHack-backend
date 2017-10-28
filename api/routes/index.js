const express = require('express');
const router = express.Router();
const userRoutes = require('./userVolunteer');
const userOrganisation = require('./userOrganisation');

router.use('/userVolunteer', userRoutes);
router.use('/userOrganisation', userOrganisation);


module.exports = router;