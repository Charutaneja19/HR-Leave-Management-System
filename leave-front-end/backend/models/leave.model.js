const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    leaveType: { type: String, required: true },
    duration: { type: String  },
    startDate: { type: String },
    endDate: { type: String },
    frequency: { type: String },
});

const Leave = mongoose.model('Leave',leaveSchema);
module.exports = Leave;
