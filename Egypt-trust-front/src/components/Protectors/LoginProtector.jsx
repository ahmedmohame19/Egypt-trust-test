import React from 'react';
import { Navigate } from 'react-router-dom'

export default function LoginProtector(props) {

    const token = localStorage.getItem('Egypt-Trust-Token');

    if (token) {
        return props.children
    } else {
        return <Navigate to={"/Login"} />
    }
}
