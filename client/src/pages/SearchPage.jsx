// client/src/pages/SearchPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import backgroundImage from '../assets/search-background.jpg';
import { FaSearch } from 'react-icons/fa';
import ManagerList from '../components/ManagerList';
import FilterSidebar from '../components/FilterSidebar';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SearchPage = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    eventType: '',
    budget: '',
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const fetchManagers = useCallback(async () => {
    if (!userInfo) return;
    
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.eventType) params.append('eventType', filters.eventType);
      if (filters.budget) params.append('budget', filters.budget);
      
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get(`http://localhost:5000/api/managers?${params.toString()}`, config);
      setManagers(data.data);
    } catch (err) {
      setError('Failed to fetch managers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userInfo, filters]);
  
  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSearch = () => {
    fetchManagers();
  };

  return (
    <div>
      {/* --- THIS IS THE CORRECTED HERO SECTION --- */}
      <div 
        className="relative h-[450px] bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full">
          <h1 className="text-4xl md:text-5xl font-bold">Find Your Perfect Event Manager</h1>
          <p className="text-lg mt-2 mb-6">Explore professionals for any occasion and budget.</p>
          <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:flex-grow bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
              <input 
                type="text" 
                name="keyword"
                placeholder="Search by event, name, or location..." 
                value={filters.keyword}
                onChange={handleFilterChange}
                className="w-full bg-transparent text-white placeholder-gray-300 p-3 border-none focus:ring-0 text-md"
              />
            </div>
            <button onClick={handleSearch} className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2">
              <FaSearch />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- Layout with Sidebar --- */}
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        <FilterSidebar filters={filters} handleFilterChange={handleFilterChange} />
        <div className="flex-grow">
          <ManagerList managers={managers} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;