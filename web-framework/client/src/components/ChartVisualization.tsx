import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement,
    ChartData,
    ChartOptions,
    ChartDataset, TooltipItem
} from 'chart.js';

// Register chart components
Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
);

interface DemographicData {
    school_name: string;
    american_indian: number;
    asian: number;
    native_hawaiian: number;
    black: number;
    hispanic: number;
    white: number;
    two_or_more_races: number;
    economically_disadvantaged: number;
    english_learner: number;
    special_education: number;
    female: number;
    male: number;
    year: number;
}

type LineDataset = ChartDataset<'line', number[]>;

interface ChartVisualizationProps {
    demographicData: DemographicData[];
}

const ChartVisualization: React.FC<ChartVisualizationProps> = ({ demographicData }) => {
    if (demographicData.length === 0) {
        return <div>Loading data...</div>;
    }

    // Extract data for racial demographics
    const schoolNames = demographicData.map(d => d.school_name);
    const racialData = {
        americanIndian: demographicData.map(d => d.american_indian || 0),
        asian: demographicData.map(d => d.asian || 0),
        nativeHawaiian: demographicData.map(d => d.native_hawaiian || 0),
        black: demographicData.map(d => d.black || 0),
        hispanic: demographicData.map(d => d.hispanic || 0),
        white: demographicData.map(d => d.white || 0),
        twoOrMoreRaces: demographicData.map(d => d.two_or_more_races || 0)
    };

    // Extract data for other demographics
    const otherDemographics = {
        economicallyDisadvantaged: demographicData.map(d => d.economically_disadvantaged || 0),
        englishLearner: demographicData.map(d => d.english_learner || 0),
        specialEducation: demographicData.map(d => d.special_education || 0)
    };

    // Extract gender data
    const genderData = {
        female: demographicData.map(d => d.female || 0),
        male: demographicData.map(d => d.male || 0)
    };

    const racialBarData: ChartData<'bar'> = {
        labels: schoolNames,
        datasets: [
            {
                label: 'American Indian/Alaskan Native',
                data: racialData.americanIndian,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Asian',
                data: racialData.asian,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Native Hawaiian/Pacific Islander',
                data: racialData.nativeHawaiian,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Black/African American',
                data: racialData.black,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
            },
            {
                label: 'Hispanic',
                data: racialData.hispanic,
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
            {
                label: 'White',
                data: racialData.white,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
            {
                label: 'Two or More Races',
                data: racialData.twoOrMoreRaces,
                backgroundColor: 'rgba(200, 100, 200, 0.6)',
            },
        ],
    };

    const otherDemographicsData: ChartData<'line'> = {
        labels: schoolNames,
        datasets: [
            {
                type: 'line',
                label: 'Economically Disadvantaged',
                data: otherDemographics.economicallyDisadvantaged,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                tension: 0.1,
                fill: true,
            },
            {
                type: 'line',
                label: 'English Learners',
                data: otherDemographics.englishLearner,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.1,
                fill: true,
            },
            {
                type: 'line',
                label: 'Special Education',
                data: otherDemographics.specialEducation,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.1,
                fill: true,
            },
        ] as LineDataset[],
    };

    const genderPieData: ChartData<'pie'> = {
        labels: ['Female', 'Male'],
        datasets: [
            {
                data: [
                    genderData.female.reduce((a, b) => a + b, 0),
                    genderData.male.reduce((a, b) => a + b, 0),
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                ],
            },
        ],
    };

    const barOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ${context.raw}%`;
                    }
                }
            }
        }
    };

    const lineOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        if (typeof value === 'number') {
                            return value + '%';
                        }
                        return value;
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (typeof context.raw === 'number') {
                            return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
                        }
                        return '';
                    }
                }
            }
        }
    };


    const pieOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context: TooltipItem<'pie'>) {
                        const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                        const value = context.parsed as number;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${percentage}%`;
                    }
                }
            }
        }
    };

    return (
        <div className="charts-container" style={{ padding: '20px' }}>
            <div className="chart" style={{ height: '400px', marginBottom: '40px' }}>
                <h3>Racial Demographics by School</h3>
                <Bar data={racialBarData} options={barOptions} />
            </div>

            <div className="chart" style={{ height: '400px', marginBottom: '40px' }}>
                <h3>Other Demographics by School</h3>
                <Line data={otherDemographicsData} options={lineOptions} />
            </div>

            <div className="chart" style={{ height: '400px' }}>
                <h3>Overall Gender Distribution</h3>
                <Pie data={genderPieData} options={pieOptions} />
            </div>
        </div>
    );
};

export default ChartVisualization;