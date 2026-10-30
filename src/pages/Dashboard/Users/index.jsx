import React from 'react';
import { Route, Routes } from 'react-router-dom';

import All from './All';
import Add from './Add';
import UserAttendance from './Attandance';
import PageNotFound from '@/components/pageNotFound';

const Users = () => {
    return (
        <Routes>
            {/* These paths are relative to the parent route (e.g., /dashboard/users/*) */}
            <Route path='all' element={<All />} />
            <Route path='add' element={<Add />} />
            <Route path='attendance' element={<UserAttendance />} />
            
            {/* Catch-all for sub-routes within the Users module */}
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    );
};

export default Users;