const express = require('express');
const router = express.Router();

const { getUserProfile } = require('../../../presentation/controller/users/users.controller');

router.get('/user-profile', getUserProfile);

module.exports = router;