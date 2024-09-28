import React, { useState, useEffect } from 'react';
import ChartVisualization from './components/ChartVisualization';
import axios from 'axios';
import './App.css';

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
        <div className="App">
            <h1>Demographic Data Visualization</h1>
            <ChartVisualization demographicData={demographicData} />
        </div>
    );
};

export default App;
