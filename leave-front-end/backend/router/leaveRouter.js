const express = require('express');
const controller = require('../controller/leave.js');

const router = express.Router();

router.post('/addFestivalLeave', controller.addFestivalLeave);
router.post('/getFestivalLeave', controller.getFestivalLeave);

module.exports = router;