// client/src/pages/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState({ users: 0, managers: 0, bookings: 0 });
    const [platformStats, setPlatformStats] = useState({ totalBookingsValue: 0, platformCommission: 0 });
    const [allManagers, setAllManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useSelector((state) => state.auth);
    
    // --- THIS IS THE CRITICAL FIX ---
    const API_BASE_URL = 'http://localhost:5000';

    const fetchData = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            
            // Add the full base URL to all axios calls
            const [usersRes, managersRes, bookingsRes, statsRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/admin/users`, config),
                axios.get(`${API_BASE_URL}/api/admin/managers`, config),
                axios.get(`${API_BASE_URL}/api/admin/bookings`, config),
                axios.get(`${API_BASE_URL}/api/admin/stats`, config)
            ]);

            setStats({ users: usersRes.data.length, managers: managersRes.data.length, bookings: bookingsRes.data.length });
            setAllManagers(managersRes.data);
            setPlatformStats(statsRes.data);
        } catch (error) {
            toast.error("Failed to fetch admin data. Please ensure the server is running.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        if (userInfo) {
            fetchData(); 
        }
    }, [userInfo]);

    const handleToggleVerify = async (managerId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            // Also add the base URL here
            const { data } = await axios.put(`${API_BASE_URL}/api/admin/managers/${managerId}/toggle-verify`, {}, config);
            
            setAllManagers(allManagers.map(m => (m._id === managerId ? data : m)));
            toast.success(`Manager status updated to: ${data.isVerified ? 'Verified' : 'Not Verified'}`);
        } catch (error) {
            toast.error('Failed to update manager status.');
        }
    };

    if (loading) return <div className="pt-32 text-center">Loading Admin Data...</div>;

    return (
        <div className="bg-gray-100 min-h-screen pt-24">
            <header className="bg-white shadow">
                <div className="container mx-auto py-6 px-4">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                </div>
            </header>
            <main className="container mx-auto py-8 px-4 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-4xl font-bold text-primary">{stats.users}</h3>
                        <p className="text-gray-500 mt-1">Total Hosts</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-4xl font-bold text-primary">{stats.managers}</h3>
                        <p className="text-gray-500 mt-1">Total Managers</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-4xl font-bold text-primary">{stats.bookings}</h3>
                        <p className="text-gray-500 mt-1">Total Bookings</p>
                    </div>
                    <div className="bg-green-100 p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-4xl font-bold text-green-800">₹{platformStats.platformCommission.toLocaleString()}</h3>
                        <p className="text-green-700 mt-1">Platform Commission</p>
                    </div>
                </div>
                
                {/* All Managers Table */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-4">Manage Event Managers</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-2 px-4 text-left font-semibold text-gray-600">Company Name</th>
                                    <th className="py-2 px-4 text-left font-semibold text-gray-600">Contact Email</th>
                                    <th className="py-2 px-4 text-left font-semibold text-gray-600">Status</th>
                                    <th className="py-2 px-4 text-left font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {allManagers.map(manager => (
                                    <tr key={manager._id}>
                                        <td className="py-3 px-4">{manager.companyName}</td>
                                        <td className="py-3 px-4">{manager.userId?.email || 'N/A'}</td>
                                        <td className="py-3 px-4">
                                            {manager.isVerified ? 
                                                <span className="text-green-600 font-semibold">Verified</span> : 
                                                <span className="text-yellow-600 font-semibold">Not Verified</span>
                                            }
                                        </td>
                                        <td className="py-3 px-4">
                                            <button 
                                                onClick={() => handleToggleVerify(manager._id)}
                                                className={`text-sm font-semibold py-1 px-3 rounded-md transition-colors ${manager.isVerified ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' : 'bg-green-200 text-green-800 hover:bg-green-300'}`}
                                            >
                                                {manager.isVerified ? 'Un-verify' : 'Verify'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default AdminDashboardPage;