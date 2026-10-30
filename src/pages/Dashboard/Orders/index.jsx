import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import All from './All';
import Add from './Add';

// Simple helper component to protect routes
const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('current_user') || '{}');
    return user.role === 'Admin' ? children : <Navigate to="/dashboard/orders/all" replace />;
};

const Orders = () => {
    return (
        <Routes>
            <Route path='all' element={<All />} />
            
            {/* Admin-only protected route */}
            <Route path='add' element={
                <AdminRoute>
                    <Add />
                </AdminRoute>
            } />
            
            <Route path='*' element={<h1>Page Not Found!</h1>} />
        </Routes>
    );
};

export default Orders;