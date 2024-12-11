import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ChartVisualization from './components/ChartVisualization';
import SearchTab from './components/SearchTab';
import GraduationComparison from './components/GraduationComparison';
import { School, GraduationData } from './types';
import './App.css';

// change the legacy school interface require too many alteration, leave the interface here instead
interface APISchool {
    school_id: number;
    school_name: string;
    school_address_city: string;
    district_name: string;
    county: string;
    total_enrollment: number;
    grades: string;
    title_i_school: string;
    economically_disadvantaged: number;
    english_learner: number;
    special_education: number;
}

const convertAPISchoolToSchool = (apiSchool: APISchool): School => {
    return {
        id: apiSchool.school_id,
        DistrictName: apiSchool.district_name,
        Name: apiSchool.school_name,
        AUN: '',
        Schl: '',
        DataElement: 'Enrollment',
        DisplayValue: apiSchool.total_enrollment
    };
};

const App: React.FC = () => {
    const [demographicData, setDemographicData] = useState<any[]>([]);
    const [graduationData, setGraduationData] = useState<GraduationData[]>([]);
    const [selectedSchools, setSelectedSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDemographicData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/demographics');
            setDemographicData(response.data);
        } catch (error) {
            console.error('Error fetching demographic data:', error);
            setError('Failed to fetch demographic data');
        }
    };

    const fetchGraduationData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/graduation-rates');
            setGraduationData(response.data);
        } catch (error) {
            console.error('Error fetching graduation data:', error);
            setError('Failed to fetch graduation data');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    fetchDemographicData(),
                    fetchGraduationData()
                ]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSearchSchoolSelect = (apiSchool: APISchool) => {
        if (selectedSchools.length < 5) {
            const school = convertAPISchoolToSchool(apiSchool);
            if (!selectedSchools.find(s => s.id === school.id)) {
                setSelectedSchools(prev => [...prev, school]);
            }
        } else {
            alert('You can compare up to 5 schools at a time');
        }
    };

    const handleRemoveSchool = (schoolId: number) => {
        setSelectedSchools(prev => prev.filter(s => s.id !== schoolId));
    };

    if (error) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()}>
                    Retry Loading Data
                </button>
            </div>
        );
    }

    return (
        <Router>
            <div className="App">
                <header>
                    <nav className="main-nav">
                        <div className="container">
                            <div className="nav-links">
                                <Link to="/">OneSearch</Link>
                                <Link to="/demographics">Demographics</Link>
                                <Link to="/graduation-rates">Graduation Rates</Link>
                                <Link to="/school-performance">School Performance</Link>
                                <Link to="/financial-analysis">Financial Analysis</Link>
                            </div>
                        </div>
                    </nav>
                </header>

                <main className="main-content">
                    {isLoading ? (
                        <div className="loading-container">
                            <p>Loading data...</p>
                        </div>
                    ) : (
                        <Routes>
                            <Route path="/" element={
                                <SearchTab
                                    onSchoolSelect={handleSearchSchoolSelect}
                                    selectedSchools={selectedSchools.map(school => ({
                                        school_id: school.id,
                                        school_name: school.Name,
                                        school_address_city: '',
                                        district_name: school.DistrictName,
                                        county: '',
                                        total_enrollment: school.DisplayValue,
                                        grades: '',
                                        title_i_school: '',
                                        economically_disadvantaged: 0,
                                        english_learner: 0,
                                        special_education: 0
                                    }))}
                                />
                            } />
                            <Route path="/demographics" element={
                                <ChartVisualization
                                    demographicData={demographicData}
                                    selectedSchools={selectedSchools}
                                    onRemoveSchool={handleRemoveSchool}
                                    isLoading={isLoading}
                                />
                            } />
                            <Route path="/graduation-rates" element={
                                <div className="container">
                                    <h1>Graduation Rate Analysis</h1>
                                    <div className="graduation-grid">
                                        <div className="comparison-section">
                                            <h2>Selected Schools Comparison</h2>
                                            <GraduationComparison
                                                selectedSchools={selectedSchools}
                                                onRemoveSchool={handleRemoveSchool}
                                            />
                                        </div>
                                    </div>
                                </div>
                            } />
                        </Routes>
                    )}
                </main>
            </div>
        </Router>
    );
};

export default App;