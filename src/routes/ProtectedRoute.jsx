// import react
import React from  'react';
import { Outlet , Navigate } from 'react-router-dom';

function ProtectedRoute ({check , to}) {
    const access = check();

    return access ? <Outlet /> : <Navigate replace to={to} />;
}

export default ProtectedRoute;