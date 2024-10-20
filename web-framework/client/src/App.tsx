import React, { useState, useEffect } from 'react';
import ChartVisualization from './components/ChartVisualization';
import axios from 'axios';
import './App.css';
import DemographicComparison from './components/DemographicComparison';
import CityComparison from './components/CityComparison';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const App: React.FC = () => {
    const [demographicData, setDemographicData] = useState<any[]>([]);

    // get demographic data
    const fetchDemographicData = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/demographics');
            setDemographicData(response.data);
        } catch (error) {
            console.error('Error fetching demographic data:', error);
        }
    };

    useEffect(() => {
        fetchDemographicData();
    }, []);

    return (
        // <div className="App">
        //     <h1>Demographic Data Visualization</h1>
        //     <ChartVisualization demographicData={demographicData} />
        // </div>
        <Router>
            <div className="App">
                <h1>School Demographic Data</h1>
                <nav>
                    <Link to="/">Home</Link>
                    <Link to="/compare">Compare Schools</Link>
                    <Link to="/compare-cities">Compare by Cities</Link>
                </nav>

                <Routes>
                    {/* chart visualization page */}
                    <Route
                        path="/"
                        element={<ChartVisualization demographicData={demographicData} />}
                    />
                    {/* demographic comparison page */}
                    <Route
                        path="/compare"
                        element={<DemographicComparison demographicData={demographicData} />}
                    />
                    {/* City comparison page */}
                    <Route
                        path="/compare-cities"
                        element={<CityComparison />}
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
