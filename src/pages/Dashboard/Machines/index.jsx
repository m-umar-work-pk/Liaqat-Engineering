import { Route, Routes, Navigate } from 'react-router-dom';

import MachinesList from './Hero';
import AddMachine from './Add';
import MachineDetails from './Details';
import PageNotFound from '@/components/pageNotFound';

const Machines = () => {
    return (
        <Routes>
            {/* List all machines (default) */}
            <Route index element={<MachinesList />} />

            {/* Add / Edit machine (Admin) */}
            <Route path='add' element={<AddMachine />} />
            <Route path='edit/:machineId' element={<AddMachine />} />

            {/* Machine details */}
            <Route path='details/:machineId' element={<MachineDetails />} />

            {/* Legacy path: /dashboard/machines/hero -> list */}
            <Route path='hero' element={<Navigate to='/dashboard/machines' replace />} />

            {/* Catch-all for sub-routes within the Machines module */}
            <Route path='*' element={<PageNotFound />} />
        </Routes>
    );
};

export default Machines;
