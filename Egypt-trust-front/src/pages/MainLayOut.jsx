import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { isTokenExpired } from '../helpers/JwtUtils';
import Sidenav from '../components/Sidenav/Sidenav';

export default function MainLayOut({ role }) {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('Egypt-Trust-Token');
        if (!token || isTokenExpired(token)) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className='flex justify-start items-center bg-[#f2f0f0]'>
            <div className="sidnav">
                <Sidenav role={role} />
            </div>
            <div className="all w-full overflow-hidden">
                <Outlet>
                </Outlet>
            </div>
        </div>
    )


}