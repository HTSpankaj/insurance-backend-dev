const express = require('express');
const router = express.Router();

const beforeIssuanceRoute = require('./beforeIssuance.route');

router.use('/before-issuance', beforeIssuanceRoute);

module.exports = router;