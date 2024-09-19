import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { ChartData } from 'chart.js';
import { School } from '../types';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);

const ChartVisualization: React.FC<{ schools: School[] }> = ({ schools }) => {

    // get data for visualization
    const districtNames = Array.from(new Set(schools.map(school => school.DistrictName)));
    const displayValues = districtNames.map(district => {
        return schools
            .filter(school => school.DistrictName === district)
            .reduce((sum, school) => sum + parseFloat(school.DisplayValue.toString()), 0); // Sum of DisplayValue per district
    });

    // bar chart
    const barData = {
        labels: districtNames,
        datasets: [
            {
                label: 'Sum of Display Values per District',
                data: displayValues,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    // pie chart
    const pieData = {
        labels: districtNames,
        datasets: [
            {
                label: 'Display Value Distribution',
                data: displayValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
            },
        ],
    };

    // line chart
    const lineData: {
        datasets: { backgroundColor: string; borderColor: string; data: number[]; label: string; fill: boolean }[];
        labels: string[]
    } = {
        labels: districtNames,
        datasets: [
            {
                label: 'Sum of Display Values per District (Line)',
                data: displayValues,
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
            },
        ],
    };

    return (
        <div className="charts-container">
            <div className="chart">
                <h3>Bar Chart: Sum of Display Values per District</h3>
                <Bar data={barData} />
            </div>
            <div className="chart">
                <h3>Pie Chart: Display Value Distribution</h3>
                <Pie data={pieData} />
            </div>
            <div className="chart">
                <h3>Line Chart: Sum of Display Values per District</h3>
                <Line data={lineData} /> {/* Use the corrected lineData */}
            </div>
        </div>
    );
};

export default ChartVisualization;
