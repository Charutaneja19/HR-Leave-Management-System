import { useState, useEffect } from 'react';
import { Calendar, Input, Modal, DatePicker, Badge, Button, Table } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './mainLeavePage.css';
import { applyLeaves, fetchLeaves } from '../services/leave-service';
import dayjs from 'dayjs';
function MainLeavePage() {
    const [leaveModalVisible, setleaveModalVisible] = useState(false);
    const [calendarModalVisible, setCalendarModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [leave, setLeave] = useState({});
    const [leavesData, setLeavesData] = useState([]);
    const [leaveEntries, setLeaveEntries] = useState([
        { id: 1, leaveName: '', frequency: '', startDate: null, endDate: null }
    ]);
    const [isOptional, setIsOptional] = useState(false);
    const [isParental, setIsParental] = useState(false);
    const columns = [
        {
            title: 'Leave Name',
            dataIndex: 'leaveName',
            key: 'leaveName',
            render: (text, record, index) => (
                <Input
                    placeholder="Leave Name"
                    value={text}
                    onChange={(e) => updateLeaveEntry(index, 'leaveName', e.target.value)}
                />
            ),
        },
        {
            title: 'Number of Days',
            dataIndex: 'frequency',
            key: 'frequency',
            render: (text, record, index) => (
                <Input
                    placeholder="Days"
                    value={text}
                    onChange={(e) => updateLeaveEntry(index, 'frequency', e.target.value)}
                />
            ),
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text, record, index) => (
                <DatePicker
                    value={text}
                    onChange={(date) => updateLeaveEntry(index, 'startDate', date)}
                />
            ),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text, record, index) => (
                <DatePicker
                    value={text}
                    onChange={(date) => updateLeaveEntry(index, 'endDate', date)}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
                leaveEntries.length > 1 && (
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => removeLeaveEntry(index)}
                    />
                )
            ),
        },
    ];

    // Learnt this using chatGPT
    const onSelect = (value) => {
        console.log('hi');
        setSelectedDate(value);
        setCalendarModalVisible(true);
        console.log('calendarModalVisible', calendarModalVisible);
    };

    const loadOptionalLeaves = async () => {
        const response = await fetchLeaves({ leaveType: 'optional leave' });
        if (response?.data?.success) {
            setLeavesData(response?.data?.data);
        }
    }

    // Call this when modal opens for optional leaves
    useEffect(() => {
        if (isOptional && leaveModalVisible) {
            loadOptionalLeaves();
        }
    }, [isOptional, leaveModalVisible]);

    const loadLeaves = async () => {
        const response = await fetchLeaves({ leaveType: 'festival' });
        if (response?.data?.success) {
            setLeavesData(response?.data?.data);
        }
    }
    useEffect(() => {
        loadLeaves();
    }, []);

    const updateLeaveEntry = (index, field, value) => {
        const updatedEntries = leaveEntries.map((entry, i) =>
            i === index ? { ...entry, [field]: value } : entry
        );
        setLeaveEntries(updatedEntries);
    };

    const removeLeaveEntry = (index) => {
        if (leaveEntries.length > 1) {
            const updatedEntries = leaveEntries.filter((_, i) => i !== index);
            setLeaveEntries(updatedEntries);
        }
    };

    const addMoreLeave = () => {
        const newEntry = {
            id: Date.now(),
            leaveName: '',
            frequency: '',
            startDate: null,
            endDate: null
        };
        setLeaveEntries([...leaveEntries, newEntry]);
    };

    async function createLeave(params, source) {
            const reqBody = {
                startDate: params.start_date,
                endDate: params.end_date,
                leaveType: params.leave_type,
                frequency: params.frequency
            }
            if (params.gender){
                reqBody.gender = params.gender;
            }
            const response = await applyLeaves(reqBody);
        
        setleaveModalVisible(false);
    }

    function onClickLeave(leaveType) {
        // createLeave({...leave, leave_type: leaveType});
        setleaveModalVisible(true);
        setLeave({
            ...leave,
            leave_type: leaveType
        });
    }
    const getLeavesForDate = (date) => {
        const dateString = date.format('YYYY-MM-DD');
        return leavesData.filter(leave => {
            const startDate = dayjs(leave.startDate);
            const endDate = dayjs(leave.endDate);
            const currentDate = dayjs(dateString);

            // Check if the current date falls within the leave period
            return currentDate.isSame(startDate, 'day') ||
                currentDate.isSame(endDate, 'day') ||
                (currentDate.isAfter(startDate, 'day') && currentDate.isBefore(endDate, 'day'));
        });
    };

    /**
     * Custom date cell renderer for calendar
     * @param {dayjs.Dayjs} value - Current date being rendered
     * @returns {JSX.Element} Rendered cell content
     */
    const dateCellRender = (value) => {
        const leavesForDate = getLeavesForDate(value);
        return (
            <div className="calendar-cell">
                {leavesForDate.map((leave, index) => (
                    <Badge
                        key={index}
                        status="success"
                        text={leave.leaveType}
                        style={{
                            display: 'block',
                            fontSize: '10px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    />
                ))}
            </div>
        );
    };
    return (
        <>  
            <div className="page-header">
                <h1 className="page-title">HR Leave Management System</h1>
            </div>
            <div className="calendarContainer">
                <div className="calendarBox">
                    <Calendar
                        onSelect={onSelect}
                        dateCellRender={dateCellRender}
                    />
                </div>
            </div>
            <Modal
                title='Festival Leave'
                open={calendarModalVisible}
                onOk={() => {
                    setCalendarModalVisible(false);
                    createLeave({
                        start_date: selectedDate,
                        end_date: selectedDate,
                        leave_type: 'festival'
                    }, 'festival');
                }}
                onCancel={() => { setCalendarModalVisible(false), setLeave({}) }}
            >
                <Input
                    placeholder='Enter Holiday Name'
                />


            </Modal>
            <div className="leaveTypeContainer">
                <span className="leaveType" onClick={() => { onClickLeave('special leave') }}>Special Leaves</span>
                <span className="leaveType" onClick={() => { onClickLeave('optional leave'); setIsOptional(true); }}>Optional Leaves</span>
                <span className="leaveType" onClick={() => { onClickLeave('casual leave') }}>Casual Leaves</span>
                <span className="leaveType" onClick={() => { onClickLeave('parental leave'); setIsParental(true); }}>Parental Leaves</span>
            </div>
            <Modal
                open={leaveModalVisible}
                onCancel={() => { setleaveModalVisible(false); setLeave({}); }}
                onOk={() => createLeave()}
            >
                <Input
                    placeholder="Leave Name"
                    value={leave.leaveName}
                    onChange={(e) => setLeave({ ...leave, leaveName: e.target.value })}

                ></Input>
                <Input
                    placeholder="Number of Leaves"
                    value={leave.numberOfLeaves}
                    onChange={(e) => setLeave({ ...leave, frequency: e.target.value })}

                ></Input>
                <div>
                    <DatePicker
                        value={startDate}
                        onChange={(date) => setStartDate(date)}>
                    </DatePicker>
                </div>
                <div>
                    <DatePicker
                        value={endDate}
                        onChange={(date) => setEndDate(date)}>
                    </DatePicker>
                </div>
            </Modal>
            <Modal
                title={isOptional ? 'Optional Leaves' : isParental ? 'Parental Leaves' : 'Leave Application'}
                open={leaveModalVisible}
                onCancel={() => {
                    setleaveModalVisible(false);
                    setLeave({});
                    setIsOptional(false);
                    setIsParental(false);
                    setLeaveEntries([{ id: 1, leaveName: '', frequency: '', startDate: null, endDate: null }]);
                }}
                onOk={() => createLeave({...leave,start_date: startDate, end_date: endDate}, 'festival')}
                width={isOptional ? 800 : 520}
            >
                {isOptional ? (
                    <>
                        {/* Show existing optional leaves from API */}
                        {leavesData.length > 0 && (
                            <div style={{ marginBottom: '16px' }}>
                                <h4>Existing Optional Leaves:</h4>
                                <Table
                                    dataSource={leavesData}
                                    columns={[
                                        { title: 'Leave Type', dataIndex: 'leaveType', key: 'leaveType' },
                                        { title: 'Days', dataIndex: 'frequency', key: 'frequency' },
                                        { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
                                        { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
                                    ]}
                                    pagination={false}
                                    size="small"
                                />
                            </div>
                        )}

                        {/* New leave entries table */}
                        <h4>Add New Optional Leaves:</h4>
                        <Table
                            dataSource={leaveEntries}
                            columns={columns}
                            pagination={false}
                            size="small"
                        />

                        <Button
                            type="dashed"
                            onClick={addMoreLeave}
                            icon={<PlusOutlined />}
                            style={{ width: '100%', marginTop: '8px' }}
                        >
                            Add More Leaves
                        </Button>
                    </>
                ) : isParental ? (
                    <>
                        <Input
                            placeholder="Gender"
                            value={leave.gender}
                            onChange={(e) => setLeave({ ...leave, gender: e.target.value })}
                            style={{ marginBottom: '12px' }}
                        />
                        <Input
                            placeholder="Number of Days"
                            value={leave.numberOfLeaves}
                            onChange={(e) => setLeave({ ...leave, frequency: e.target.value })}
                            style={{ marginBottom: '12px' }}
                        />
                    </>
                ) : (
                    // Regular leave form for other leave types
                    <div>
                        <Input
                            placeholder="Leave Name"
                            value={leave.leaveName}
                            onChange={(e) => setLeave({ ...leave, leaveName: e.target.value })}
                            style={{ marginBottom: '12px' }}
                        />
                        <Input
                            placeholder="Number of Leaves"
                            value={leave.numberOfLeaves}
                            onChange={(e) => setLeave({ ...leave, frequency: e.target.value })}
                            style={{ marginBottom: '12px' }}
                        />
                        <div>
                            <DatePicker
                                value={startDate}
                                onChange={(date) => setStartDate(date)}
                                placeholder="Start Date"
                            />
                            <DatePicker
                                value={endDate}
                                onChange={(date) => setEndDate(date)}
                                placeholder="End Date"
                            />
                        </div>
                    </div>
                )}
            </Modal>

        </>
    )
};

export default MainLeavePage;