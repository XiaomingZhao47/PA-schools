import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// reg chart components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface ChartVisualizationProps {
    demographicData: any[]; // data passed from App.tsx
}

const ChartVisualization: React.FC<ChartVisualizationProps> = ({ demographicData }) => {
    if (demographicData.length === 0) {
        return <div>Loading data...</div>;
    }

    // get school data for visualization
    const schoolNames = demographicData.map((d: any) => d.School_Name);
    const americanIndian = demographicData.map((d: any) => d.American_Indian_Alaskan_Native || 0);
    const asian = demographicData.map((d: any) => d.Asian || 0);
    const black = demographicData.map((d: any) => d.Black_African_American || 0);
    const hispanic = demographicData.map((d: any) => d.Hispanic || 0);
    const white = demographicData.map((d: any) => d.White || 0);
    const twoOrMoreRaces = demographicData.map((d: any) => d.Two_or_More_Races || 0);

    const barData = {
        labels: schoolNames,
        datasets: [
            {
                label: 'American Indian/Alaskan Native',
                data: americanIndian,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Asian',
                data: asian,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Black/African American',
                data: black,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Hispanic',
                data: hispanic,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
            },
            {
                label: 'White',
                data: white,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
            {
                label: 'Two or More Races',
                data: twoOrMoreRaces,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
        ],
    };

    const pieData = {
        labels: ['American Indian', 'Asian', 'Black', 'Hispanic', 'White', 'Two or More Races'],
        datasets: [
            {
                data: [
                    americanIndian.reduce((a: number, b: number) => a + b, 0),
                    asian.reduce((a: number, b: number) => a + b, 0),
                    black.reduce((a: number, b: number) => a + b, 0),
                    hispanic.reduce((a: number, b: number) => a + b, 0),
                    white.reduce((a: number, b: number) => a + b, 0),
                    twoOrMoreRaces.reduce((a: number, b: number) => a + b, 0),
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
            },
        ],
    };

    return (
        <div className="charts-container">
            <div className="chart">
                <h3>Bar Chart: Demographics per School</h3>
                <Bar data={barData} />
            </div>
            <div className="chart">
                <h3>Pie Chart: Overall Demographics Distribution</h3>
                <Pie data={pieData} />
            </div>
        </div>
    );
};

export default ChartVisualization;
