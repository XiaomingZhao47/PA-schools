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
    isLoading?: boolean;
}

const ChartVisualization: React.FC<ChartVisualizationProps> = ({ demographicData, isLoading = false }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-lg text-gray-600">Loading demographic data...</div>
            </div>
        );
    }

    if (!demographicData?.length) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-lg text-gray-600">No demographic data available</div>
            </div>
        );
    }

    const top100Schools = [...demographicData]
        .sort((a, b) => {
            const totalA = a.american_indian + a.asian + a.native_hawaiian + a.black +
                a.hispanic + a.white + a.two_or_more_races;
            const totalB = b.american_indian + b.asian + b.native_hawaiian + b.black +
                b.hispanic + b.white + b.two_or_more_races;
            return totalB - totalA;
        })
        .slice(0, 100);

    const schoolNames = top100Schools.map(d => d.school_name);

    // get data for racial demographics
    const racialBarData: ChartData<'bar'> = {
        labels: schoolNames,
        datasets: [
            {
                label: 'American Indian',
                data: top100Schools.map(d => d.american_indian || 0),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
                label: 'Asian',
                data: top100Schools.map(d => d.asian || 0),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
                label: 'Native Hawaiian',
                data: top100Schools.map(d => d.native_hawaiian || 0),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
                label: 'Black',
                data: top100Schools.map(d => d.black || 0),
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
            },
            {
                label: 'Hispanic',
                data: top100Schools.map(d => d.hispanic || 0),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
            {
                label: 'White',
                data: top100Schools.map(d => d.white || 0),
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
            },
            {
                label: 'Two or More Races',
                data: top100Schools.map(d => d.two_or_more_races || 0),
                backgroundColor: 'rgba(200, 100, 200, 0.6)',
            },
        ],
    };


    // get data for other demographics
    const otherDemographicsData: ChartData<'line'> = {
        labels: schoolNames,
        datasets: [
            {
                type: 'line',
                label: 'Economically Disadvantaged',
                data: top100Schools.map(d => d.economically_disadvantaged || 0),
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                tension: 0.1,
                fill: true,
            },
            {
                type: 'line',
                label: 'English Learners',
                data: top100Schools.map(d => d.english_learner || 0),
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.1,
                fill: true,
            },
            {
                type: 'line',
                label: 'Special Education',
                data: top100Schools.map(d => d.special_education || 0),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.1,
                fill: true,
            },
        ] as LineDataset[],
    };

    // get gender data
    const totalFemale = top100Schools.reduce((sum, school) => sum + (school.female || 0), 0);
    const totalMale = top100Schools.reduce((sum, school) => sum + (school.male || 0), 0);

    const genderPieData: ChartData<'pie'> = {
        labels: ['Female', 'Male'],
        datasets: [
            {
                data: [totalFemale, totalMale],
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
        <div className="p-4">
            <div className="grid grid-cols-1 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Racial Demographics by School</h3>
                    <div className="h-[400px]">
                        <Bar data={racialBarData} options={barOptions} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Other Demographics by School</h3>
                    <div className="h-[400px]">
                        <Line data={otherDemographicsData} options={lineOptions} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Overall Gender Distribution</h3>
                    <div className="h-[400px]">
                        <Pie data={genderPieData} options={pieOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartVisualization;