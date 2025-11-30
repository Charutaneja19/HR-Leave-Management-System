const express = require('express');
const controller = require('../controller/leave.js');

const router = express.Router();

router.post('/addFestivalLeave', controller.addFestivalLeave);
router.post('/getFestivalLeave', controller.getFestivalLeave);
router.post('/sign-in', controller.handleUserSignIn);
router.post('/sign-up', controller.handleUserSignUp);
router.post('/getUserData', controller.getUserData);
router.post('/handleGetAllUser', controller.handleGetAllUser);
router.post('/getLeavesForEmployee', controller.getLeavesForEmployee);
router.post('/getLeavesForAllSubordinates', controller.getLeavesForAllSubordinates);
router.post('/handleApproveReject', controller.handleApproveReject);
router.post('/createLeaveRequest', controller.createLeaveRequest);
module.exports = router;