import React from 'react'
import DashNav from '../components/DashNav'
import Sidebar from '../components/Sidebar';
import './index.css';
import backgroundImage from '../assets/backgroundDB.svg';
import DashboardContent from '../components/DashboardContent';
import {Outlet} from 'react-router-dom';
const Dashboard = () => {
  return (
    <div className='h-[100vh] font-urbanist bg-cover bg-center bg-[#F8F7F1]'>
        {/* <DashNav /> */}
        <Sidebar />
        <Outlet />
        {/* <DashboardContent className='overflow-hidden'/> */}
    </div>
  )
}

export default Dashboard