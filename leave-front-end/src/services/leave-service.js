import axios from 'axios';

export const applyLeaves = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/addFestivalLeave', params);
    return response;
}

export const fetchLeaves = async (params) => {
    const response = await axios.post('http://localhost:8000/leave/getFestivalLeave', params);
    return response;
}