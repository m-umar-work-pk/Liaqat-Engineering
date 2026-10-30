import { Route, Routes } from 'react-router-dom';
import PrivateRoute from "@/components/PrivateRoute"; // Ensure this import is correct

// Import Frontend components
import Home from '../Frontend/Home';
import About from '../Frontend/About';
import Contact from '../Frontend/Contact';
import Services from '../Frontend/Services';
import Overview from '../Frontend/Dashboard';
// Import Dasboard components
import Machines from '../Dashboard/Machines';
import Projects from '../Dashboard/Projects';
import Customers from '../Dashboard/Customers';
import Users from '../Dashboard/Users';
import Orders from '../Dashboard/Orders';
import Settings from '../Dashboard/Settings';
import RecycleBin from '../Dashboard/RecycleBin';

import PageNotFound from '@/components/pageNotFound';
// ... (your other imports)

const AppRoutes = () => {
    return (
        <Routes>
            {/* Dashboard Home - Open to all logged-in users */}
            <Route path='/home' element={
                <PrivateRoute allowedRoles={['Admin', 'Worker', 'Customer']}>
                    <Home />
                </PrivateRoute>
            } />
            <Route path='/about' element={
                <PrivateRoute allowedRoles={['Admin', 'Worker', 'Customer']}>
                    <About />
                </PrivateRoute>
            } />
            <Route path='/contact' element={
                <PrivateRoute allowedRoles={['Admin', 'Worker', 'Customer']}>
                    <Contact />
                </PrivateRoute>
            } />
            <Route path='/services' element={
                <PrivateRoute allowedRoles={['Admin', 'Worker', 'Customer']}>
                    <Services />
                </PrivateRoute>
            } />

            {/* CRUD Modules - Protected by role (Example: Admin only) */}

            <Route path='/projects/*' element={
                <PrivateRoute allowedRoles={['Admin', 'Customer', 'Worker']}>
                    <Projects />
                </PrivateRoute>
            } />

            <Route path='/customers/*' element={
                <PrivateRoute allowedRoles={['Admin', 'Customer', 'Worker']}>
                    <Customers />
                </PrivateRoute>
            } />

            <Route path='/orders/*' element={
                <PrivateRoute allowedRoles={['Admin', 'Customer']}>
                    <Orders />
                </PrivateRoute>
            } />

            <Route path='/users/*' element={
                <PrivateRoute allowedRoles={['Admin', "Customer", "Worker"]}>
                    <Users />
                </PrivateRoute>
            } />

            <Route path='/machines/*' element={
                <PrivateRoute allowedRoles={['Admin', 'Customer', 'Worker']}>
                    <Machines />
                </PrivateRoute>
            } />

            <Route path='/dashboard/*' element={
                <PrivateRoute allowedRoles={['Admin']}>
                    <Overview />
                </PrivateRoute>
            } />
            <Route path='/settings/*' element={
                <PrivateRoute allowedRoles={['Admin']}>
                    <Settings />
                </PrivateRoute>
            } />

            <Route path='/recyclebin/*' element={
                <PrivateRoute allowedRoles={['Admin']}>
                    <RecycleBin />
                </PrivateRoute>
            } />

            <Route path='*' element={
                <PrivateRoute allowedRoles={['Admin', 'Customer', 'Worker']}>
                    <PageNotFound />
                </PrivateRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;