import { Route, Routes, Navigate } from 'react-router-dom';
import React from 'react';
import Register from './Register';
import Login from './Login';
import ForgotPassword from './Forgotpassword';
import PageNotFound from '@/components/pageNotFound';

const Auth = () => {
    return (
        <Routes>
            {/* Redirect base /auth/ to /auth/login */}
            <Route path='/' element={<Navigate to="/auth/login" replace />} />
            
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            
            {/* Catch-all for undefined sub-routes under /auth/* */}
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    );
};

export default Auth;