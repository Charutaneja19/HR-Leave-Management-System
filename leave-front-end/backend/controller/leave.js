const Leave = require('../models/leave.model');


const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user.model.js');
const LeaveRequests = require('../models/leave_request');

async function handleUserSignUp(req, res) {

    const { firstName, lastName, email, password, role } = req.body;
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
    try {
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hash,
            salt,
            role
        });

        return res.status(201).json({
            data: {
                employeeId: user.employeeId,
                managerId: user.managerId,
                role: user.role
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }

}

async function handleUserSignIn(req, res) {
    const { username, password } = req.body;
    console.log('username', username);
    const userInDb = await User.findOne({ email: username });
    console.log('userInDb', userInDb);
    if (!userInDb) {
        return res.status(404).json({ error: 'User not found' });
    }
    const hash = crypto.createHmac('sha256', userInDb.salt).update(password).digest('hex');
    if (hash !== userInDb.password) {
        return res.status(404).json({ error: 'Invalid password' });
    }
    const token = jwt.sign({ id: userInDb._id, email: userInDb.email, role: userInDb.role }, 'charu@123');  //data, sign
    return res.status(200).json({
        message: `success in sign in for ${userInDb.firstName}`,
        token,
        employeeId: userInDb.employeeId,
        managerId: userInDb.managerId,
        role: userInDb.role
    });


}

async function getUserData(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }
        return res.status(200).json({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                photo: user.photo
            }
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }

}

async function handleGetAllUser(req, res) {

    console.log('headers', req.headers);
    // const {} = req.headers;
    const payload = jwt.verify(token, 'charu@123');
    if (payload?.role !== 'admin') {
        return res.status(403).json({ error: 'You are not allowed' });
    }
    const userRecord = await User.find({});
    return res.status(200).json({ data: userRecord });

}

async function getLeavesForAllSubordinates(req, res) {
    try {
        const { id } = req.body;
        const leaveRecord = await LeaveRequests.find({ approver_id: id });
        res.status(200).json({ success: true, data: leaveRecord });

    } catch (err) {
        console.error('error in fetching leaves', err);
        res.status(500).json({ success: false });
    }
};

async function getLeavesForEmployee(req, res) {
    try {
        const { employeeId } = req.body;
        const leaveRecord = await LeaveRequests.find({ employeeId: employeeId });
        res.status(200).json({ success: true, data: leaveRecord });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}

async function addFestivalLeave(req, res) {
    const { leaveType, duration, startDate, endDate, frequency } = req.body;
    try {
        const insertedLeave = await Leave.create({
            leaveType,
            startDate: startDate ? startDate : undefined,
            endDate: endDate ? endDate : undefined,
            frequency: frequency ? frequency : undefined
        });

        return res.status(201).json({
            data: {
                id: insertedLeave.id
            }
        });
    } catch (err) {
        throw err;
    }
}

async function getFestivalLeave(req, res) {
    const { leaveType } = req.body;
    try {

        const query = Array.isArray(leaveType)
            ? { leaveType: { $in: leaveType } }
            : { leaveType };

        const fetchedLeave = await Leave.find(query);
        if (!fetchedLeave) {
            return res.status(404).json({
                success: false,
                error: 'Not Found'
            });
        }

        return res.status(200).json({
            success: true,
            data: fetchedLeave
        })
    } catch (err) {
        throw err;
    }
}

async function handleApproveReject(req, res) {
    const { leaveId, action } = req.body;
    const leaveRecord = await LeaveRequests.findOneAndUpdate({ _id: leaveId }, {
        $set: {
            status: action === 'approve' ? 'approved' : 'rejected'
        }
    })
    if (!leaveRecord) {
        return res.status(400).json({ success: false, message: 'Leave Record not found' });
    }

}

async function createLeaveRequest(req, res) {
    console.log('req.body', req.body);
    const { leaveType, startDate, endDate, employeeId, approverId, reason } = req.body.leave;
    try {
        const leaveRecord = await LeaveRequests.create({
            leaveType,
            startDate,
            endDate,
            employeeId,
            approverId,
            reason,
            status: 'pending'
        });
        return res.status(201).json({
            data: {
                id: leaveRecord.id
            }
        });
    } catch (err) {
        throw err;
    }
}
module.exports = {
    getFestivalLeave,
    addFestivalLeave,
    handleUserSignIn,
    handleUserSignUp,
    getUserData,
    handleGetAllUser,
    getLeavesForEmployee,
    getLeavesForAllSubordinates,
    handleApproveReject,
    createLeaveRequest
};