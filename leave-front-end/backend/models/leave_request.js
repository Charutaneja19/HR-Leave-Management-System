const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    leaveType: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String },
    employeeId: { type: String, required: true },
    approverId: { type: String, required: true },
    status: { type: String },
    reason: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    rejectReason: { type: String },
});

const LeaveRequests = mongoose.model('LeaveRequest',leaveRequestSchema);
module.exports = LeaveRequests;
