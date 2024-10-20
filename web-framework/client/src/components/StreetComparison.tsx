import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

interface SchoolData {
    School_Name: string;
    American_Indian_Alaskan_Native: number;
    Asian: number;
    Native_Hawaiian_or_other_Pacific_Islander: number;
    Black_African_American: number;
    Hispanic: number;
    White: number;
    Two_or_More_Races: number;
    Economically_Disadvantaged: number;
    English_Learner: number;
    Special_Education: number;
    Female_School: number;
    Male_School: number;
}

const StreetComparison: React.FC = () => {
    const [streetsData, setStreetsData] = useState<{ [street: string]: SchoolData[] }>({});
    const [filteredStreets, setFilteredStreets] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
    const [comparisonData, setComparisonData] = useState<any>(null);

    // get streets and school data
    useEffect(() => {
        axios.get('http://localhost:5001/api/streets')
            .then(response => {
                setStreetsData(response.data);
                setFilteredStreets(Object.keys(response.data)); // Initially show all streets
            })
            .catch(error => console.error('Error fetching streets data:', error));
    }, []);

    // handle street selection
    const handleStreetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const street = e.target.value;
        setSelectedStreet(street);
        updateChartData(streetsData[street]);
    };

    // update the chart data
    const updateChartData = (schools: SchoolData[]) => {
        const labels = ['American Indian', 'Asian', 'Native Hawaiian', 'Black', 'Hispanic', 'White', 'Two or More Races',
            'Economically Disadvantaged', 'English Learner', 'Special Education', 'Female', 'Male'];

        const datasets = schools.map((school) => ({
            label: school.School_Name,
            data: [
                school.American_Indian_Alaskan_Native,
                school.Asian,
                school.Native_Hawaiian_or_other_Pacific_Islander,
                school.Black_African_American,
                school.Hispanic,
                school.White,
                school.Two_or_More_Races,
                school.Economically_Disadvantaged,
                school.English_Learner,
                school.Special_Education,
                school.Female_School,
                school.Male_School
            ],
            backgroundColor: getRandomColor(),
        }));

        setComparisonData({ labels, datasets });
    };

    // filter streets
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        // based on the search term
        const filtered = Object.keys(streetsData).filter((street) =>
            street.toLowerCase().includes(searchTerm)
        );

        setFilteredStreets(filtered);
    };

    const getRandomColor = () => {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="comparison-container">
            <h2>Compare Schools by Street</h2>

            {/* Search input */}
            <label>Search Street:</label>
            <input
                type="text"
                placeholder="Search street..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="street-search-input"
            />

            <label>Select Street:</label>
            <select onChange={handleStreetChange} className="street-select">
                <option value="">Select a street</option>
                {filteredStreets.map((street) => (
                    <option key={street} value={street}>
                        {street}
                    </option>
                ))}
            </select>

            {comparisonData && (
                <div className="chart">
                    <Bar data={comparisonData} />
                </div>
            )}
        </div>
    );
};

export default StreetComparison;
