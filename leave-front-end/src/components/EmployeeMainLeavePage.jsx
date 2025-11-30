import { getLeavesForEmployee, createLeaveRequest } from '../services/leave-service';
import { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Input, Typography } from 'antd';
import { ReloadOutlined , PlusOutlined } from '@ant-design/icons';
const { Title } = Typography;


export default function Admin() {

    const [leavesData, setLeavesData] = useState([]);
    const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
    const [leave, setLeave] = useState({
        leaveType: 'casual',
        startDate: '',
        endDate: '',
        reason: '',
        employeeId: '',
        approverId: '',
    });

    async function loadLeaves() {
        const employeeId = localStorage.getItem('employeeId');
        const response = await getLeavesForEmployee({ employeeId });
        console.log('response', response.data.data);
        setLeavesData(response?.data?.data);
    }

    async function createLeave() {
        const employeeId = localStorage.getItem('employeeId');
        const approverId = localStorage.getItem('managerId');
        leave.employeeId = employeeId;
        leave.approverId = approverId;
        const response = await createLeaveRequest({ leave });
        console.log('response', response.data.data);
        setIsLeaveModalVisible(false);
    }

    useEffect(() => {
        loadLeaves();
    }, []);


    const columns = [
        {
            title: 'Leave Type',
            dataIndex: 'leaveType',
            key: 'leaveType',
        },
        {
            title: 'Duration',
            key: 'duration',
            render: (_, record) => `${record.startDate} to ${record.endDate}`
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'blue';
                if (status === 'approved') color = 'green';
                if (status === 'rejected') color = 'red';
                return <span style={{ color }}>{status}</span>;
            }
        },
        {
            title: 'Reason',
            key: 'reason',
            dataIndex: 'reason',
        },
    ];
    return (
        <>
            <div className="employee-container">
                <div className="employee-header">
                    <Title level={2} className="page-title">Employee Leave Management Dashboard</Title>
                    <Space size="middle">
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={() => loadLeaves()}
                        >
                            Refresh
                        </Button>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsLeaveModalVisible(true)}
                        >
                            Create Leave
                        </Button>
                    </Space>
                </div>
                <Modal
                    title="Create Leave"
                    open={isLeaveModalVisible}
                    onCancel={() => setIsLeaveModalVisible(false)}
                    onOk={() => createLeave()}
                >
                    <Input type="text" placeholder="Leave Type" value={leave.leaveType} onChange={(e) => setLeave({ ...leave, leaveType: e.target.value })} />
                    <Input type="text" placeholder="Start Date" value={leave.startDate} onChange={(e) => setLeave({ ...leave, startDate: e.target.value })} />
                    <Input type="text" placeholder="End Date" value={leave.endDate} onChange={(e) => setLeave({ ...leave, endDate: e.target.value })} />
                    <Input type="text" placeholder="Reason" value={leave.reason} onChange={(e) => setLeave({ ...leave, reason: e.target.value })} />
                </Modal>
                <div className="table-container">
                    <Table
                        dataSource={leavesData}
                        columns={columns}
                        rowKey="id"
                    // pagination={{ pageSize: 10 }}
                    />
                </div>
            </div>
        </>
    )
}