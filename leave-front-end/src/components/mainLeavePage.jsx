import { useState , useEffect } from 'react';
import { Calendar, Input, Modal, DatePicker, Badge } from 'antd';
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

    // Learnt this using chatGPT
    const onSelect = (value) => {
        console.log('hi');
        setSelectedDate(value);
        setCalendarModalVisible(true);
        console.log('calendarModalVisible', calendarModalVisible);
    };

    const loadLeaves = async () => {
        const response = await fetchLeaves({leaveType: 'festival'});
        if (response?.data?.success){
            setLeavesData(response?.data?.data);
        }
    }
    useEffect (() => {
        loadLeaves();
    }, []);

    async function createLeave(params, source) {
        if (source == 'festival') {
            const reqBody = {
                startDate: params.start_date,
                endDate: params.end_date,
                leaveType: params.leave_type,
                frequency: params.frequency
            }
            const response = await applyLeaves(reqBody);
        } else {
            const reqBody = {
            startDate: leave.start_date,
            endDate: leave.end_date,
            leaveType: leave.leave_type,
            frequency: leave.frequency
        }
        const response = await applyLeaves(reqBody);
        }
        setleaveModalVisible(false);
    }

    function onClickLeave(leaveType) {
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
                <span className="leaveType" onClick={() => {onClickLeave('special leave')}}>Special Leaves</span>
                <span className="leaveType" onClick={() => {onClickLeave('optional leave')}}>Optional Leaves</span>
                <span className="leaveType" onClick={() => {onClickLeave('casual leave')}}>Casual Leaves</span>
                <span className="leaveType" onClick={() => {onClickLeave('parental leave')}}>Parental Leaves</span>
                <span className="leaveType" onClick={() => {onClickLeave('festival leave')}}>Festival Leaves</span>
            </div>
            <Modal
                open={leaveModalVisible}
                onCancel={() => { setleaveModalVisible(false); setLeave({}); }}
                onOk = {() => createLeave()}
            >
                <Input
                    placeholder="Leave Name"
                    value={leave.leaveName}
                    onChange={(e) => setLeave({...leave, leaveName: e.target.value})}

                ></Input>
                <Input
                    placeholder="Number of Leaves"
                    value={leave.numberOfLeaves}
                    onChange={(e) => setLeave({...leave, frequency: e.target.value})}

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

        </>
    )
};

export default MainLeavePage;