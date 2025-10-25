const Leave = require('../models/leave.model');
async function addFestivalLeave(req, res) {
    const { leaveType, duration, startDate, endDate, frequency } = req.body;
    try {
        const insertedLeave = await Leave.create({
            leaveType,
            startDate: startDate ? startDate : undefined,
            endDate: endDate ? endDate : undefined,
            frequency : frequency ? frequency : undefined
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

module.exports = { getFestivalLeave, addFestivalLeave }