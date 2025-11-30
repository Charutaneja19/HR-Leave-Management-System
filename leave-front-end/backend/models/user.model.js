const { Schema } = require('mongoose');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String },
    department: String,
    managerId: String,
    employeeId: String,
    joinDate: Date,
    leaveBalance: {
        casual: Number,
        sick: Number,
        annual: Number
    }
});

const Users = mongoose.model('User', userSchema);
module.exports = Users;
