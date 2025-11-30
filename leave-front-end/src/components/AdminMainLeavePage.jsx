import { Table, Button, Space } from 'antd';
import { useState, useEffect } from 'react';
import { handleApproveReject, getLeavesForAllSubordinates} from '../services/leave-service';
export default function AdminMaineLeavePage(){
    const [leavesData, setLeavesData] = useState([]);

      
    const loadLeaves = async () => {
      const employeeId = localStorage.getItem('employeeId');
      const response = await getLeavesForAllSubordinates({employeeId});
      setLeavesData(response?.data?.data);
    }
    useEffect(() => {
      loadLeaves();
    }, []);

    const columns = [
        {
            title: 'Employee Name',
            dataIndex: 'employeeId',
            key: 'employeeName',
        },
        {
            title: 'Leave Type',
            dataIndex: 'leaveType',
            key: 'leaveType',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Actions',
            key: 'actions',
        },
    ];
    const handleApprove = (id) => {
      handleApproveReject({leaveId : id, action: 'approve'});

    }

    const handleReject = (id) => {
      handleApproveReject({leaveId: id , action: 'reject'});

    }
    const generateColumns = () => {
        return columns.map(column => {
            if (column.key === 'actions') {
                return {
                    ...column,
                render :( _, record ) => (
                    record.status === 'pending' ? (
                        <Space>
                            <Button type="primary" onClick = {() => handleApprove(record._id)}>
                                Approve
                            </Button>
                            <Button type="primary" onClick = {() => handleReject(record._id)}>
                                Reject
                            </Button>
                        </Space>
                    )  : null )
            }
        }
        return column;
        })
        
    }
    // useEffect (() => {
    //     fetchLeaves();
    // }, []);
    return (
        <>
        <h6>Admin Leave Page</h6>
        <Table dataSource={leavesData} columns={generateColumns()} />
        </>
    )
}