import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../../Context/Usercontext';



export default function RoleProtector({ children, requiredRole }) {

    const { userRole } = useContext(UserContext);
    console.log("userRole from protector", userRole)

    if (userRole === null) {
        return <div>Loading...</div>;
    }
    if (userRole === requiredRole) {
        return children;
    } else {
        return <Navigate to="/login" />;
    }
}
