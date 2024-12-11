import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ChartVisualization from './components/ChartVisualization';
import DemographicComparison from './components/DemographicComparison';
import CityComparison from './components/CityComparison';
import GraduationSearch from './components/GraduationSearch';
import GraduationComparison from './components/GraduationComparison';
import { GraduationData } from './types';
import './App.css';

const App: React.FC = () => {
    const [demographicData, setDemographicData] = useState<any[]>([]);
    const [graduationData, setGraduationData] = useState<GraduationData[]>([]);
    const [selectedSchools, setSelectedSchools] = useState<GraduationData[]>([]);

    // get demographic data
    const fetchDemographicData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/demographics');
            setDemographicData(response.data);
        } catch (error) {
            console.error('Error fetching demographic data:', error);
        }
    };

    // get graduation data
    const fetchGraduationData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/graduation-rates');
            setGraduationData(response.data);
        } catch (error) {
            console.error('Error fetching graduation data:', error);
        }
    };

    useEffect(() => {
        fetchDemographicData();
        fetchGraduationData();
    }, []);

    const handleSchoolSelect = (school: GraduationData) => {
        if (selectedSchools.length < 5) {
            setSelectedSchools([...selectedSchools, school]);
        } else {
            alert('You can compare up to 5 schools at a time');
        }
    };

    const handleRemoveSchool = (school: GraduationData) => {
        setSelectedSchools(selectedSchools.filter(s => s.district_name !== school.district_name));
    };

    return (
        <Router>
            <div className="App">
                <nav className="bg-gray-800 p-4">
                    <div className="container mx-auto flex space-x-4">
                        <Link to="/" className="text-white hover:text-gray-300">Home</Link>
                        <Link to="/compare" className="text-white hover:text-gray-300">Compare Schools</Link>
                        <Link to="/compare-cities" className="text-white hover:text-gray-300">Compare by Cities</Link>
                        <Link to="/graduation-rates" className="text-white hover:text-gray-300">Graduation Rates</Link>
                    </div>
                </nav>

                <div className="container mx-auto p-4">
                    <Routes>
                        <Route path="/" element={<ChartVisualization demographicData={demographicData} />} />
                        <Route path="/compare" element={<DemographicComparison demographicData={demographicData} />} />
                        <Route path="/compare-cities" element={<CityComparison />} />
                        <Route
                            path="/graduation-rates"
                            element={
                                <div>
                                    <h1 className="text-2xl font-bold mb-4">Graduation Rate Analysis</h1>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                            <h2 className="text-xl font-semibold mb-2">Search Districts</h2>
                                            <GraduationSearch
                                                graduationData={graduationData}
                                                onSchoolSelect={handleSchoolSelect}
                                                selectedSchools={selectedSchools}
                                            />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold mb-2">Comparison</h2>
                                            <GraduationComparison
                                                selectedSchools={selectedSchools}
                                                onRemoveSchool={handleRemoveSchool}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;