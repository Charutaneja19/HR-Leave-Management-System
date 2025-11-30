import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminMainLeavePage from './components/AdminMainLeavePage';
import EmployeeMainLeavePage from './components/EmployeeMainLeavePage';
import HRmainLeavePage from './components/HRmainLeavePage';
import App from './App.jsx'
import Login from './components/Login';

createRoot(document.getElementById('root')).render(
  <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login></Login>} />
        <Route path="Admin" element = {<AdminMainLeavePage/>} />
        <Route path="User" element = {<EmployeeMainLeavePage/>} />
        <Route path="HR" element = {<HRmainLeavePage/>} />
      </Routes>
    </Router>
)
