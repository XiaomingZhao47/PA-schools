import React, { useState, useEffect } from 'react';
import SearchComponent from './components/SearchComponent';
import DisplayData from './components/DisplayData';
import AddDataForm from './components/AddDataForm';
import ChartVisualization from './components/ChartVisualization';
import axios from "axios";
import './App.css';
import { School } from './types';

const App: React.FC = () => {
    const [schools, setSchools] = useState<School[]>([]);
    const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
    const [view, setView] = useState<'list' | 'charts'>('list');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortField, setSortField] = useState<string>('DistrictName');

    // get schools from the database
    const fetchSchools = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/data');
            setSchools(response.data);
            setFilteredSchools(response.data);
        } catch (error) {
            console.error('Error fetching school data:', error);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    // search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        filterAndSortSchools(value, sortField);
    };

    // sorting change
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const field = e.target.value;
        setSortField(field);
        filterAndSortSchools(searchTerm, field);
    };

    // filter and sort schools
    const filterAndSortSchools = (search: string, sortBy: string) => {
        let filtered = schools.filter((school) =>
            school.DistrictName.toLowerCase().includes(search.toLowerCase()) ||
            school.Name.toLowerCase().includes(search.toLowerCase())
        );

        filtered.sort((a, b) => {
            if (a[sortBy as keyof School] < b[sortBy as keyof School]) return -1;
            if (a[sortBy as keyof School] > b[sortBy as keyof School]) return 1;
            return 0;
        });

        setFilteredSchools(filtered);
    };

    return (
        <div className="App">
            <h1>School Management</h1>
            <div className="tabs">
                <button onClick={() => setView('list')} className={view === 'list' ? 'active' : ''}>
                    View Schools
                </button>
                <button onClick={() => setView('charts')} className={view === 'charts' ? 'active' : ''}>
                    View Charts
                </button>
            </div>

            {view === 'list' && (
                <div className="list-view">
                    <AddDataForm refreshSchools={fetchSchools} />

                    <div className="search-sort">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <select value={sortField} onChange={handleSortChange}>
                            <option value="DistrictName">Sort by District Name</option>
                            <option value="Name">Sort by School Name</option>
                            <option value="AUN">Sort by AUN</option>
                            <option value="Schl">Sort by Schl</option>
                            <option value="DataElement">Sort by Data Element</option>
                        </select>
                    </div>

                    <DisplayData schools={filteredSchools} refreshSchools={fetchSchools} />
                </div>
            )}

            {view === 'charts' && (
                <div className="charts-view">
                    <ChartVisualization schools={schools} />
                </div>
            )}
        </div>
    );
};

export default App;
