import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate} from 'react-router-dom';
import ChartVisualization from './components/ChartVisualization';
import DemographicComparison from './components/DemographicComparison';
import CityComparison from './components/CityComparison';
import GraduationSearch from './components/GraduationSearch';
import HomeSearch from './components/HomeSearch';
import SearchTab from './components/SearchTab/SearchTab';
import GraduationComparison from './components/GraduationComparison';
import { GraduationData } from './types';
import './App.css';

const App: React.FC = () => {
    const [demographicData, setDemographicData] = useState<any[]>([]);
    const [graduationData, setGraduationData] = useState<GraduationData[]>([]);
    const [selectedSchools, setSelectedSchools] = useState<GraduationData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                <nav className="main-nav">
                    <div className="container mx-auto">
                        <div className="nav-links">
                            <Link to="/">Home</Link>
                            <Link to="/demographics">Demographics</Link>
                            <Link to="/compare">Compare Schools</Link>
                            <Link to="/compare-cities">Compare by Cities</Link>
                            <Link to="/graduation-rates">Graduation Rates</Link>
                        </div>
                    </div>
                </nav>

                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<SearchTab />} />
                        <Route path="/demographics" element={<ChartVisualization demographicData={demographicData} />} />
                        <Route path="/compare" element={<DemographicComparison demographicData={demographicData} />} />
                        <Route path="/compare-cities" element={<CityComparison />} />
                        <Route path="/graduation-rates" element={
                            <div className="container">
                                <h1>Graduation Rate Analysis</h1>
                                <div className="graduation-grid">
                                    <div className="search-section">
                                        <h2>Search Districts</h2>
                                        <GraduationSearch
                                            graduationData={graduationData}
                                            onSchoolSelect={handleSchoolSelect}
                                            selectedSchools={selectedSchools}
                                        />
                                    </div>
                                    <div className="comparison-section">
                                        <h2>Comparison</h2>
                                        <GraduationComparison
                                            selectedSchools={selectedSchools}
                                            onRemoveSchool={handleRemoveSchool}
                                        />
                                    </div>
                                </div>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;