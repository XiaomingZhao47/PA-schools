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

const CityComparison: React.FC = () => {
    const [citiesData, setCitiesData] = useState<{ [city: string]: SchoolData[] }>({});
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [comparisonData, setComparisonData] = useState<any>(null);

    // get cities and school data
    useEffect(() => {
        axios.get('http://localhost:5001/api/cities')
            .then(response => {
                setCitiesData(response.data);
                setFilteredCities(Object.keys(response.data)); // Initially show all cities
            })
            .catch(error => console.error('Error fetching cities data:', error));
    }, []);

    // handle city selection
    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const city = e.target.value;
        setSelectedCity(city);
        updateChartData(citiesData[city]);
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

    // filter cities
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        // Filter the cities based on the search term
        const filtered = Object.keys(citiesData).filter((city) =>
            city.toLowerCase().includes(searchTerm)
        );

        setFilteredCities(filtered);
    };

    const getRandomColor = () => {
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div className="comparison-container">
            <h2>Compare Schools by City</h2>

            {/* search input */}
            <label>Search City:</label>
            <input
                type="text"
                placeholder="Search city..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="city-search-input"
            />

            <label>Select City:</label>
            <select onChange={handleCityChange} className="city-select">
                <option value="">Select a city</option>
                {filteredCities.map((city) => (
                    <option key={city} value={city}>
                        {city}
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

export default CityComparison;
