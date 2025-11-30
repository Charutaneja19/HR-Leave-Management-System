import axios from 'axios';
import api from './api';

export const applyLeaves = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/addFestivalLeave', params);
    return response;
}

export const getLeavesForEmployee = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/getLeavesForEmployee', params);
    return response;
}

export const fetchLeaves = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/getFestivalLeave', params);
    return response;
}

export const handleUserSignIn = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/sign-in', params);
    return response;
}

export const handleUserSignUp = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/sign-up', params);
    return response;
}

export const getUserData = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/getUserData', params);
    return response;
}

export const handleGetAllUser = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/handleGetAllUser', params);
    return response;
}

export const getLeavesForAllSubordinates = async ( params ) => {
    const response = await api.post('leave/getLeavesForAllSubordinates', params);
    return response;
}

export const handleApproveReject = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/handleApproveReject',params);
    return response;
};

export const createLeaveRequest = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/createLeaveRequest', params);
    return response;
};