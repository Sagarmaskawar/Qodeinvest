import React from 'react'
import './HomePage.css'
import SideBar from '../SIdeBar/SideBar'
import { Link, Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <div className='home-page'>
        <SideBar/>
        <Outlet/>
    </div>
  )
}

export default HomePage